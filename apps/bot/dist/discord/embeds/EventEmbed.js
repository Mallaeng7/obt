"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmbed = void 0;
const discord_js_1 = require("discord.js");
class EventEmbed extends discord_js_1.EmbedBuilder {
    constructor(heli, cargo, crate, rig) {
        super();
        this.setTitle('Server Events Timeline')
            .setColor('#3498db')
            .addFields({ name: '🚁 Patrol Heli', value: heli || 'Unknown', inline: true }, { name: '🚢 Cargo Ship', value: cargo || 'Unknown', inline: true }, { name: '📦 Locked Crate', value: crate || 'Unknown', inline: true }, { name: '🛢️ Oil Rig', value: rig || 'Unknown', inline: true })
            .setTimestamp();
    }
}
exports.EventEmbed = EventEmbed;
