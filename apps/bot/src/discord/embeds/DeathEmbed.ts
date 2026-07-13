import { EmbedBuilder } from 'discord.js';

export class DeathEmbed extends EmbedBuilder {
  constructor(playerName: string, x: number, y: number, grid: string) {
    super();
    this.setTitle('💀 Team Member Death')
      .setColor('#9b59b6')
      .setDescription(`**${playerName}** has died!`)
      .addFields(
        { name: 'Location', value: `Grid: ${grid} (X: ${x}, Y: ${y})` }
      )
      .setTimestamp();
  }
}
