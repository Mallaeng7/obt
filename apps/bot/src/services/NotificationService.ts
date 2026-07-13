import { events } from '../core/EventEmitterHub';
import { rustPlusManager } from '../core/RustPlusManager';
import { prisma } from '../database/client';
import { discordBot } from '../discord/DiscordBot';
import { TextChannel, EmbedBuilder } from 'discord.js';
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

    events.on('fcm:pairing', async (payload: any) => {
      console.log('[NotificationService] Pairing request received:', payload);
      try {
        const port = parseInt(payload.port, 10);
        let server = await prisma.server.findFirst({ where: { ip: payload.ip, port } });
        
        if (!server && payload.playerToken) {
          server = await prisma.server.create({
            data: {
              ip: payload.ip,
              port,
              appPort: port,
              name: payload.desc || payload.name,
              steamId: payload.playerId,
              playerToken: payload.playerToken,
              isActive: true
            }
          });
          rustPlusManager.addServer(server.id, server.ip, server.port, server.steamId, server.playerToken);
          rustPlusManager.getServer(server.id)?.connect();
          console.log(`[NotificationService] Automatically paired to new server: ${server.name}`);
        }
      } catch (e) {
        console.error('[NotificationService] Failed to handle pairing:', e);
      }
    });
  }

  private async sendDiscordAlert(serverId: string, title: string, message: string, color: number = 0xFFA500, speak: boolean = false) {
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
    switch(type) {
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
