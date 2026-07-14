import { events } from '../core/EventEmitterHub';
import { rustPlusManager } from '../core/RustPlusManager';
import { prisma } from '../database/client';
import { discordBot } from '../discord/DiscordBot';
import {
  TextChannel,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Message,
} from 'discord.js';
import { voiceClient } from '../discord/VoiceClient';
import { pairingManager, PendingPairing } from '../core/PairingManager';

export class NotificationService {
  constructor() {
    events.on('map:event', async (serverId, event) => {
      const server = rustPlusManager.getServer(serverId);
      if (!server) return;
      const msg = this.formatEventMessage(event.type);
      if (msg) {
        await server.client.sendTeamMessage(msg);
        await this.sendDiscordAlert(serverId, `🗺️ Map Event`, msg);
      }
    });

    events.on('device:alarm', async (serverId, alarm) => {
      const server = rustPlusManager.getServer(serverId);
      if (!server) return;
      const msg = `🚨 ALARM [${alarm.name}]: ${alarm.title} - ${alarm.message}`;
      await server.client.sendTeamMessage(msg);
      await this.sendDiscordAlert(serverId, `🚨 Smart Alarm: ${alarm.name}`, alarm.message, 0xFF0000, true);
    });

    events.on('team:memberDeath', async (serverId, death) => {
      const msg = `💀 ${death.steamId} was killed by ${death.killerName || 'unknown'}`;
      await this.sendDiscordAlert(serverId, `💀 Team Death`, msg, 0x8B0000);
    });

    // FCM Pairing request
    events.on('fcm:pairing', async (payload: any) => {
      try {
        const pairing = pairingManager.addPairing(payload);
        await this.handlePairingRequest(pairing);
      } catch (e) {
        console.error('[NotificationService] Failed to handle pairing:', e);
      }
    });
  }

  private async getServersChannel(): Promise<TextChannel | null> {
    const guilds = discordBot.client.guilds.cache;
    for (const guild of guilds.values()) {
      const ch = guild.channels.cache.find(
        (c) => c.isTextBased() && (c.name === 'servers' || c.name === 'server')
      ) as TextChannel | undefined;
      if (ch) return ch;
    }
    return null;
  }

  private async findExistingMessage(channel: TextChannel, ip: string): Promise<Message | null> {
    try {
      const messages = await channel.messages.fetch({ limit: 50 });
      return messages.find((m) => {
        if (m.author.id !== discordBot.client.user?.id) return false;
        if (!m.embeds[0]) return false;
        const ipField = m.embeds[0].fields.find((f) => f.name === '🌐 IP Address');
        return ipField?.value === `\`${ip}\``;
      }) || null;
    } catch {
      return null;
    }
  }

  /**
   * Discord #servers 채널에 페어링 요청 임베드 전송 (또는 수정)
   */
  public async handlePairingRequest(pairing: PendingPairing) {
    const targetChannel = await this.getServersChannel();
    if (!targetChannel) return;

    const existingServer = await prisma.server.findFirst({ where: { ip: pairing.ip, port: pairing.port } });
    const isCurrentlyConnected = !!existingServer && !!rustPlusManager.getServer(existingServer.id);

    const embed = new EmbedBuilder()
      .setTitle(`🦀 ${pairing.serverName}`)
      .addFields(
        { name: '🌐 IP Address', value: `\`${pairing.ip}\``, inline: true },
        { name: '🔌 App Port', value: `\`${pairing.appPort}\``, inline: true },
        { name: '🆔 Steam ID', value: pairing.steamId ? `\`${pairing.steamId}\`` : '_Unknown_', inline: true },
      )
      .setTimestamp();

    let row: ActionRowBuilder<ButtonBuilder>;

    if (isCurrentlyConnected) {
      embed.setColor(0x00C853)
           .setDescription(`✅ Successfully connected to **${pairing.serverName}**!\n🤖 Bot is monitoring this server.`);
      row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder().setCustomId('dummy_connected').setLabel('✅ Connected').setStyle(ButtonStyle.Success).setDisabled(true)
      );
    } else {
      embed.setColor(existingServer ? 0xFFA500 : 0xE53935)
           .setDescription(
             existingServer
               ? '⚠️ Server is registered but disconnected. Click **Reconnect** to re-establish connection.'
               : '📡 A new Rust server is requesting to be paired with the bot.'
           );
      
      const connectBtn = new ButtonBuilder()
        .setCustomId(`pair_connect_${pairing.ip}_${pairing.port}`)
        .setLabel(existingServer ? '🔁 Reconnect' : '✅ Connect')
        .setStyle(existingServer ? ButtonStyle.Primary : ButtonStyle.Success);
        
      const ignoreBtn = new ButtonBuilder()
        .setCustomId(`pair_ignore_${pairing.ip}_${pairing.port}`)
        .setLabel('❌ Ignore')
        .setStyle(ButtonStyle.Danger);

      row = new ActionRowBuilder<ButtonBuilder>().addComponents(connectBtn, ignoreBtn);
    }

    const existingMsg = await this.findExistingMessage(targetChannel, pairing.ip);
    if (existingMsg) {
      await existingMsg.edit({ embeds: [embed], components: [row] });
    } else {
      await targetChannel.send({ embeds: [embed], components: [row] });
    }
  }

  public async handleButtonInteraction(interaction: any) {
    if (!interaction.customId.startsWith('pair_')) return;
    await interaction.deferUpdate();

    const parts = interaction.customId.split('_');
    const action = parts[1]; // connect or ignore
    const ip = parts[2];
    const portStr = parts[3];
    const port = parseInt(portStr, 10);
    const existingMsg = await this.findExistingMessage(interaction.channel as TextChannel, ip);

    if (action === 'ignore' && existingMsg) {
      const ignoredEmbed = EmbedBuilder.from(existingMsg.embeds[0])
        .setColor(0x9E9E9E)
        .setDescription('❌ Pairing request ignored.')
        .setFooter({ text: `Ignored by ${interaction.user.tag}` });
      await existingMsg.edit({ embeds: [ignoredEmbed], components: [] });
      pairingManager.removePairing(ip, port);
      return;
    }

    if (action === 'connect') {
      try {
        const pending = pairingManager.getPairings().find(p => p.ip === ip && p.port === port);
        const serverName = pending?.serverName || `${ip}:${port}`;
        let server = await prisma.server.findFirst({ where: { ip, port } });

        if (!server && pending) {
          server = await prisma.server.create({
            data: {
              name: serverName,
              ip: pending.ip,
              port: pending.port,
              appPort: pending.appPort,
              steamId: pending.steamId,
              playerToken: pending.playerToken,
              discordGuildId: interaction.guildId,
              isActive: true,
            },
          });
        }

        if (server) {
          await rustPlusManager.addServer(server.id, server.ip, server.appPort, server.steamId, server.playerToken);
          await this.markServerConnectedInDiscord(ip, port, server.name);
          pairingManager.removePairing(ip, port);
        }
      } catch (err: any) {
        console.error('[NotificationService] Connect failed:', err);
        await interaction.followUp({ content: `❌ Failed to connect: ${err.message}`, ephemeral: true });
      }
    }
  }

  /**
   * 외부(웹 등)에서 서버 연결 시 호출하여 Discord 메시지를 ✅ Connected로 업데이트
   */
  public async markServerConnectedInDiscord(ip: string, port: number, serverName: string) {
    const targetChannel = await this.getServersChannel();
    if (!targetChannel) return;

    const existingMsg = await this.findExistingMessage(targetChannel, ip);
    if (!existingMsg) return;

    const embed = EmbedBuilder.from(existingMsg.embeds[0])
      .setColor(0x00C853)
      .setDescription(`✅ Successfully connected to **${serverName}**!\n🤖 Bot is monitoring this server.`);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder().setCustomId('dummy_connected').setLabel('✅ Connected').setStyle(ButtonStyle.Success).setDisabled(true)
    );

    await existingMsg.edit({ embeds: [embed], components: [row] });
  }

  private async sendDiscordAlert(serverId: string, title: string, message: string, color: number = 0xFFA500, speak: boolean = false) {
    try {
      const server = await prisma.server.findUnique({ where: { id: serverId } });
      if (!server || !server.alertChannelId) return;

      const channel = await discordBot.client.channels.fetch(server.alertChannelId) as TextChannel;
      if (channel && channel.isTextBased()) {
        const embed = new EmbedBuilder().setTitle(title).setDescription(message).setColor(color).setTimestamp();
        await channel.send({ embeds: [embed] });
        if (speak && process.env.TTS_ENABLED === 'true') {
          await voiceClient.speak(channel.guild.id, message);
        }
      }
    } catch (e) {
      console.error(`[NotificationService] Error sending discord alert:`, e);
    }
  }

  private formatEventMessage(type: string): string | null {
    switch (type) {
      case 'heli': return '🚁 Patrol Helicopter inbound!';
      case 'cargo': return '🚢 Cargo Ship is in the waters!';
      case 'chinook': return '🚁 Chinook is dropping a locked crate!';
      case 'locked_crate': return '📦 Locked crate has been dropped!';
      case 'oil_rig_small': return '🛢️ Small Oil Rig crate is being hacked!';
      case 'oil_rig_large': return '🛢️ Large Oil Rig crate is being hacked!';
      case 'deep_sea': return '🌊 Deep sea event detected!';
      default: return null;
    }
  }
}

export const notificationService = new NotificationService();
