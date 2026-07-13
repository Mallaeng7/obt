import { EmbedBuilder } from 'discord.js';

export class EventEmbed extends EmbedBuilder {
  constructor(heli: string, cargo: string, crate: string, rig: string) {
    super();
    this.setTitle('Server Events Timeline')
      .setColor('#3498db')
      .addFields(
        { name: '🚁 Patrol Heli', value: heli || 'Unknown', inline: true },
        { name: '🚢 Cargo Ship', value: cargo || 'Unknown', inline: true },
        { name: '📦 Locked Crate', value: crate || 'Unknown', inline: true },
        { name: '🛢️ Oil Rig', value: rig || 'Unknown', inline: true }
      )
      .setTimestamp();
  }
}
