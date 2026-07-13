import { Client, TextChannel } from 'discord.js';
import { DeviceEmbed } from '../embeds/DeviceEmbed';
import { CONSTANTS } from '../../config/constants';

export class DeviceTracker {
  private client: Client;
  private channelId: string;
  private messageId?: string;

  constructor(client: Client, channelId: string) {
    this.client = client;
    this.channelId = channelId;
  }

  public async start() {
    setInterval(() => this.update(), CONSTANTS.POLLING_INTERVALS.DEVICE_TRACKER);
    await this.update();
  }

  private async update() {
    const channel = await this.client.channels.fetch(this.channelId) as TextChannel;
    if (!channel) return;

    try {
      const server = require('../../core/RustPlusManager').rustplusManager.getAllServers()[0];
      if (!server) return;
      const deviceRepository = require('../../database/repositories/DeviceRepository').deviceRepository;
      const devices = await deviceRepository.findByServer(server.id);
      const embed = new DeviceEmbed(devices);

      if (this.messageId) {
        const msg = await channel.messages.fetch(this.messageId);
        await msg.edit({ embeds: [embed] });
      } else {
        const msg = await channel.send({ embeds: [embed] });
        this.messageId = msg.id;
      }
    } catch (e) {
      console.error('[DeviceTracker] Failed to update:', e);
    }
  }
}
