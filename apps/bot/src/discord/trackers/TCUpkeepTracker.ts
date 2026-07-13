import { Client, TextChannel, EmbedBuilder } from 'discord.js';
import { rustPlusManager } from '../../core/RustPlusManager';
import { CONSTANTS } from '../../config/constants';

export class TCUpkeepTracker {
  private client: Client;
  private channelId: string;
  private messageId?: string;

  constructor(client: Client, channelId: string) {
    this.client = client;
    this.channelId = channelId;
  }

  public async start() {
    setInterval(() => this.update(), CONSTANTS.POLLING_INTERVALS.TC_UPKEEP_TRACKER);
    await this.update();
  }

  private async update() {
    const channel = await this.client.channels.fetch(this.channelId) as TextChannel;
    if (!channel) return;

    try {
      const server = rustPlusManager.getAllServers()[0];
      if (!server) return;
      const deviceRepository = require('../../database/repositories/DeviceRepository').deviceRepository;
      const devices = await deviceRepository.findByServer(server.id);
      const tc = devices.find((d: any) => d.type === 'storage_monitor' || d.name.toLowerCase().includes('tc'));
      
      let upkeepText = 'Unknown';
      if (tc) {
        try {
          const info = await server.client.getEntityInfo(tc.entityId);
          upkeepText = info.capacity ? `${info.capacity} slots left` : 'Active';
        } catch(e) {
          upkeepText = 'Failed to fetch';
        }
      }

      const embed = new EmbedBuilder()
        .setTitle('Tool Cupboard Upkeep')
        .setColor('#f1c40f')
        .setDescription(`Upkeep: ${upkeepText}`);

      if (this.messageId) {
        const msg = await channel.messages.fetch(this.messageId);
        await msg.edit({ embeds: [embed] });
      } else {
        const msg = await channel.send({ embeds: [embed] });
        this.messageId = msg.id;
      }
    } catch (e) {
      console.error('[TCUpkeepTracker] Failed to update:', e);
    }
  }
}
