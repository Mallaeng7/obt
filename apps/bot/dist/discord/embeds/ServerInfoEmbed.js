"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerInfoEmbed = void 0;
const discord_js_1 = require("discord.js");
class ServerInfoEmbed extends discord_js_1.EmbedBuilder {
    constructor(serverName, players, maxPlayers, time, mapSize, seed) {
        super();
        this.setTitle(`Rust Server: ${serverName}`)
            .setColor('#FF6B35')
            .addFields({ name: 'Pop', value: `${players}/${maxPlayers}`, inline: true }, { name: 'Time', value: time, inline: true }, { name: 'Map', value: `Size: ${mapSize} | Seed: ${seed}`, inline: true })
            .setTimestamp();
    }
}
exports.ServerInfoEmbed = ServerInfoEmbed;
