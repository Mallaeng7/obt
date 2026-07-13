"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertEmbed = void 0;
const discord_js_1 = require("discord.js");
class AlertEmbed extends discord_js_1.EmbedBuilder {
    constructor(title, description, type = 'alarm') {
        super();
        this.setTitle(type === 'alarm' ? `🚨 ${title}` : `⚠️ ${title}`)
            .setColor(type === 'alarm' ? '#e74c3c' : '#f1c40f')
            .setDescription(description)
            .setTimestamp();
    }
}
exports.AlertEmbed = AlertEmbed;
