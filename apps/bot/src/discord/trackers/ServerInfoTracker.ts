import { Client, TextChannel } from 'discord.js';
import { rustPlusManager } from '../../core/RustPlusManager';
import { ServerInfoEmbed } from '../embeds/ServerInfoEmbed';
import { CONSTANTS } from '../../config/constants';

export class ServerInfoTracker {
  private client: Client;
  private channelId: string;
  private messageId?: string;

  constructor(client: Client, channelId: string) {
    this.client = client;
    this.channelId = channelId;
  }

  public async start() {
    setInterval(() => this.update(), CONSTANTS.POLLING_INTERVALS.SERVER_INFO_TRACKER);
    await this.update();
  }

  private async update() {
    // Logic to update Server Info embed
    const channel = await this.client.channels.fetch(this.channelId) as TextChannel;
    if (!channel) return;
    
    // Example logic using the first active server
    const server = rustPlusManager.getAllServers()[0];
    if (!server) return;

    try {
      const info = await server.client.getServerInfo();
      const time = await server.client.getTime();
      const embed = new ServerInfoEmbed(info.name, info.players, info.maxPlayers, time.time, info.mapSize, info.seed);

      if (this.messageId) {
        const msg = await channel.messages.fetch(this.messageId);
        await msg.edit({ embeds: [embed] });
      } else {
        const msg = await channel.send({ embeds: [embed] });
        this.messageId = msg.id;
      }
    } catch (e) {
      console.error('[ServerInfoTracker] Failed to update:', e);
    }
  }
}
