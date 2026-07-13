"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceEmbed = void 0;
const discord_js_1 = require("discord.js");
class DeviceEmbed extends discord_js_1.EmbedBuilder {
    constructor(devices) {
        super();
        this.setTitle('Smart Devices Control')
            .setColor('#2ecc71');
        if (devices.length === 0) {
            this.setDescription('No paired devices found.');
        }
        else {
            devices.forEach(d => {
                this.addFields({ name: d.name, value: d.status ? '🟢 ON' : '🔴 OFF', inline: true });
            });
        }
        this.setTimestamp();
    }
}
exports.DeviceEmbed = DeviceEmbed;
