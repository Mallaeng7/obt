"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeathEmbed = void 0;
const discord_js_1 = require("discord.js");
class DeathEmbed extends discord_js_1.EmbedBuilder {
    constructor(playerName, x, y, grid) {
        super();
        this.setTitle('💀 Team Member Death')
            .setColor('#9b59b6')
            .setDescription(`**${playerName}** has died!`)
            .addFields({ name: 'Location', value: `Grid: ${grid} (X: ${x}, Y: ${y})` })
            .setTimestamp();
    }
}
exports.DeathEmbed = DeathEmbed;
