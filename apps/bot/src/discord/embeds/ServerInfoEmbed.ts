import { EmbedBuilder } from 'discord.js';

export class ServerInfoEmbed extends EmbedBuilder {
  constructor(serverName: string, players: number, maxPlayers: number, time: string, mapSize: number, seed: number) {
    super();
    this.setTitle(`Rust Server: ${serverName}`)
      .setColor('#FF6B35')
      .addFields(
        { name: 'Pop', value: `${players}/${maxPlayers}`, inline: true },
        { name: 'Time', value: time, inline: true },
        { name: 'Map', value: `Size: ${mapSize} | Seed: ${seed}`, inline: true }
      )
      .setTimestamp();
  }
}
