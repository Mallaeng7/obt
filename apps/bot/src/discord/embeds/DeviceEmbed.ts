import { EmbedBuilder } from 'discord.js';

export class DeviceEmbed extends EmbedBuilder {
  constructor(devices: { name: string, status: boolean, type: string }[]) {
    super();
    this.setTitle('Smart Devices Control')
      .setColor('#2ecc71');
      
    if (devices.length === 0) {
      this.setDescription('No paired devices found.');
    } else {
      devices.forEach(d => {
        this.addFields({ name: d.name, value: d.status ? '🟢 ON' : '🔴 OFF', inline: true });
      });
    }
    this.setTimestamp();
  }
}
