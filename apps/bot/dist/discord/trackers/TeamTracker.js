"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamTracker = void 0;
const discord_js_1 = require("discord.js");
const RustPlusManager_1 = require("../../core/RustPlusManager");
const constants_1 = require("../../config/constants");
class TeamTracker {
    client;
    channelId;
    messageId;
    constructor(client, channelId) {
        this.client = client;
        this.channelId = channelId;
    }
    async start() {
        setInterval(() => this.update(), constants_1.CONSTANTS.POLLING_INTERVALS.TEAM_TRACKER);
        await this.update();
    }
    async update() {
        const channel = await this.client.channels.fetch(this.channelId);
        if (!channel)
            return;
        const server = RustPlusManager_1.rustPlusManager.getAllServers()[0];
        if (!server)
            return;
        try {
            const team = await server.client.getTeamInfo();
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle('Team Status')
                .setColor('#2ecc71');
            team.members.forEach((m) => {
                embed.addFields({ name: m.name, value: m.isOnline ? '🟢 Online' : '🔴 Offline', inline: true });
            });
            if (this.messageId) {
                const msg = await channel.messages.fetch(this.messageId);
                await msg.edit({ embeds: [embed] });
            }
            else {
                const msg = await channel.send({ embeds: [embed] });
                this.messageId = msg.id;
            }
        }
        catch (e) {
            console.error('[TeamTracker] Failed to update:', e);
        }
    }
}
exports.TeamTracker = TeamTracker;
