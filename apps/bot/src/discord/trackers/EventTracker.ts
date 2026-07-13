import { Client, TextChannel } from 'discord.js';
import { rustPlusManager } from '../../core/RustPlusManager';
import { EventEmbed } from '../embeds/EventEmbed';
import { CONSTANTS } from '../../config/constants';

export class EventTracker {
  private client: Client;
  private channelId: string;
  private messageId?: string;

  constructor(client: Client, channelId: string) {
    this.client = client;
    this.channelId = channelId;
  }

  public async start() {
    setInterval(() => this.update(), CONSTANTS.POLLING_INTERVALS.EVENT_TRACKER);
    await this.update();
  }

  private async update() {
    const channel = await this.client.channels.fetch(this.channelId) as TextChannel;
    if (!channel) return;
    
    const server = rustPlusManager.getAllServers()[0];
    if (!server) return;

    try {
      const markers = await server.client.getMapMarkers();
      
      const heli = markers.some((m: any) => m.type === CONSTANTS.EVENT_TYPES.HELI) ? 'Active' : 'Inactive';
      const cargo = markers.some((m: any) => m.type === CONSTANTS.EVENT_TYPES.CARGO) ? 'Active' : 'Inactive';
      const crate = markers.some((m: any) => m.type === CONSTANTS.EVENT_TYPES.LOCKED_CRATE) ? 'Active' : 'Inactive';
      const rig = markers.some((m: any) => m.type && String(m.type).toLowerCase().includes('oil_rig')) ? 'Active' : 'Inactive';

      const embed = new EventEmbed(heli, cargo, crate, rig);

      if (this.messageId) {
        const msg = await channel.messages.fetch(this.messageId);
        await msg.edit({ embeds: [embed] });
      } else {
        const msg = await channel.send({ embeds: [embed] });
        this.messageId = msg.id;
      }
    } catch (e) {
      console.error('[EventTracker] Failed to update:', e);
    }
  }
}
