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
  ComponentType,
  InteractionCollector,
} from 'discord.js';
import { voiceClient } from '../discord/VoiceClient';

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

    // ──────────────────────────────────────────────────────────────
    // FCM Pairing: 러스트에서 "Pair with Server" 버튼을 눌렀을 때
    // ──────────────────────────────────────────────────────────────
    events.on('fcm:pairing', async (payload: any) => {
      console.log('[NotificationService] Pairing request received:', payload);
      try {
        await this.handlePairingRequest(payload);
      } catch (e) {
        console.error('[NotificationService] Failed to handle pairing:', e);
      }
    });
  }

  /**
   * FCM 페어링 알림을 받으면 #servers 채널에 서버 정보 임베드와 Connect 버튼을 전송합니다.
   */
  private async handlePairingRequest(payload: any) {
    const ip: string = payload.ip;
    const port: number = parseInt(payload.port, 10);
    const appPort: number = payload.appPort ? parseInt(payload.appPort, 10) : port + 67;
    const steamId: string = payload.playerId || payload.steamId || '';
    const playerToken: string = payload.playerToken || '';
    const serverName: string = payload.name || payload.desc || `${ip}:${port}`;

    // Discord 클라이언트에서 "servers" 이름의 텍스트 채널을 모든 길드에서 탐색
    const guilds = discordBot.client.guilds.cache;
    let targetChannel: TextChannel | null = null;

    for (const guild of guilds.values()) {
      const ch = guild.channels.cache.find(
        (c) => c.isTextBased() && (c.name === 'servers' || c.name === 'server')
      ) as TextChannel | undefined;
      if (ch) {
        targetChannel = ch;
        break;
      }
    }

    if (!targetChannel) {
      console.warn('[NotificationService] No #servers channel found in any guild.');
      return;
    }

    // 이미 DB에 등록된 서버인지 확인
    const existingServer = await prisma.server.findFirst({ where: { ip, port } });

    const embed = new EmbedBuilder()
      .setTitle(`🦀 ${serverName}`)
      .setColor(existingServer ? 0x00C853 : 0xE53935)
      .setDescription(
        existingServer
          ? '✅ This server is already paired. Click **Reconnect** to re-establish connection.'
          : '📡 A new Rust server is requesting to be paired with the bot.'
      )
      .addFields(
        { name: '🌐 IP Address', value: `\`${ip}\``, inline: true },
        { name: '🔌 App Port', value: `\`${appPort}\``, inline: true },
        { name: '🆔 Steam ID', value: steamId ? `\`${steamId}\`` : '_Unknown_', inline: true },
      )
      .setFooter({ text: 'Click Connect to add this server.' })
      .setTimestamp();

    const connectBtn = new ButtonBuilder()
      .setCustomId('pair_connect')
      .setLabel(existingServer ? '🔁 Reconnect' : '✅ Connect')
      .setStyle(existingServer ? ButtonStyle.Primary : ButtonStyle.Success);

    const ignoreBtn = new ButtonBuilder()
      .setCustomId('pair_ignore')
      .setLabel('❌ Ignore')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(connectBtn, ignoreBtn);

    const msg = await targetChannel.send({ embeds: [embed], components: [row] });

    // 버튼 인터랙션 수집 (10분)
    const collector = msg.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 10 * 60 * 1000,
    });

    collector.on('collect', async (interaction) => {
      await interaction.deferUpdate();

      if (interaction.customId === 'pair_ignore') {
        const ignoredEmbed = EmbedBuilder.from(embed)
          .setColor(0x9E9E9E)
          .setDescription('❌ Pairing request ignored.')
          .setFooter({ text: `Ignored by ${interaction.user.tag}` });
        await msg.edit({ embeds: [ignoredEmbed], components: [] });
        collector.stop();
        return;
      }

      if (interaction.customId === 'pair_connect') {
        try {
          let server = existingServer;

          if (!server) {
            // 새 서버 DB 등록
            server = await prisma.server.create({
              data: {
                name: serverName,
                ip,
                port,
                appPort,
                steamId,
                playerToken,
                discordGuildId: interaction.guildId,
                isActive: true,
              },
            });
          }

          // 봇 연결
          await rustPlusManager.addServer(
            server.id,
            server.ip,
            server.appPort,
            server.steamId,
            server.playerToken
          );

          const connectedEmbed = EmbedBuilder.from(embed)
            .setColor(0x00C853)
            .setDescription(`✅ Successfully connected to **${serverName}**!\n\n🤖 Bot is now monitoring this server.`)
            .setFooter({ text: `Connected by ${interaction.user.tag}` });

          await msg.edit({ embeds: [connectedEmbed], components: [] });
          collector.stop();
        } catch (err: any) {
          console.error('[NotificationService] Connect failed:', err);
          await interaction.followUp({
            content: `❌ Failed to connect: ${err.message}`,
            ephemeral: true,
          });
        }
      }
    });

    collector.on('end', async (_collected, reason) => {
      if (reason === 'time') {
        const expiredEmbed = EmbedBuilder.from(embed)
          .setColor(0x9E9E9E)
          .setDescription('⏰ Pairing request expired (no response in 10 minutes).')
          .setFooter({ text: 'Request timed out' });
        await msg.edit({ embeds: [expiredEmbed], components: [] }).catch(() => {});
      }
    });
  }

  private async sendDiscordAlert(
    serverId: string,
    title: string,
    message: string,
    color: number = 0xFFA500,
    speak: boolean = false
  ) {
    try {
      const server = await prisma.server.findUnique({ where: { id: serverId } });
      if (!server || !server.alertChannelId) return;

      const channel = await discordBot.client.channels.fetch(server.alertChannelId) as TextChannel;
      if (channel && channel.isTextBased()) {
        const embed = new EmbedBuilder()
          .setTitle(title)
          .setDescription(message)
          .setColor(color)
          .setTimestamp();

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
