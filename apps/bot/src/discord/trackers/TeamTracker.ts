import { Client, TextChannel, EmbedBuilder } from 'discord.js';
import { rustPlusManager } from '../../core/RustPlusManager';
import { CONSTANTS } from '../../config/constants';

export class TeamTracker {
  private client: Client;
  private channelId: string;
  private messageId?: string;

  constructor(client: Client, channelId: string) {
    this.client = client;
    this.channelId = channelId;
  }

  public async start() {
    setInterval(() => this.update(), CONSTANTS.POLLING_INTERVALS.TEAM_TRACKER);
    await this.update();
  }

  private async update() {
    const channel = await this.client.channels.fetch(this.channelId) as TextChannel;
    if (!channel) return;
    
    const server = rustPlusManager.getAllServers()[0];
    if (!server) return;

    try {
      const team = await server.client.getTeamInfo();
      const embed = new EmbedBuilder()
        .setTitle('Team Status')
        .setColor('#2ecc71');

      team.members.forEach((m: any) => {
        embed.addFields({ name: m.name, value: m.isOnline ? '🟢 Online' : '🔴 Offline', inline: true });
      });

      if (this.messageId) {
        const msg = await channel.messages.fetch(this.messageId);
        await msg.edit({ embeds: [embed] });
      } else {
        const msg = await channel.send({ embeds: [embed] });
        this.messageId = msg.id;
      }
    } catch (e) {
      console.error('[TeamTracker] Failed to update:', e);
    }
  }
}
