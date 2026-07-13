"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackerManager = exports.TrackerManager = void 0;
const discord_js_1 = require("discord.js");
const client_1 = require("../../database/client");
const RustPlusManager_1 = require("../../core/RustPlusManager");
const time_1 = require("../../utils/time");
class TrackerManager {
    client;
    intervalId = null;
    // Keep track of message IDs for the tracker embed so we can edit instead of resending
    trackerMessages = new Map();
    init(client) {
        this.client = client;
        this.startTracking();
    }
    startTracking() {
        if (this.intervalId)
            clearInterval(this.intervalId);
        // Update every 1 minute
        this.intervalId = setInterval(() => this.updateAllTrackers(), 60000);
    }
    async updateAllTrackers() {
        const servers = await client_1.prisma.server.findMany({
            where: { trackerChannelId: { not: null } }
        });
        for (const server of servers) {
            if (!server.trackerChannelId)
                continue;
            try {
                await this.updateServerTracker(server);
            }
            catch (e) {
                console.error(`[Tracker] Failed to update tracker for ${server.name}:`, e);
            }
        }
    }
    async updateServerTracker(server) {
        const channel = await this.client.channels.fetch(server.trackerChannelId);
        if (!channel || !channel.isTextBased())
            return;
        const instance = RustPlusManager_1.rustPlusManager.getServer(server.id);
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(`📊 Server Tracker: ${server.name}`)
            .setTimestamp();
        if (!instance) {
            embed.setColor(0xFF0000).setDescription('Server is currently disconnected.');
        }
        else {
            try {
                const info = await instance.client.getServerInfo();
                const { timeString, isNight, timeUntilDay, timeUntilNight } = (0, time_1.getGameTime)(info.env.time, info.env.sunrise, info.env.sunset);
                embed.setColor(isNight ? 0x000080 : 0x87CEEB); // Navy for night, SkyBlue for day
                // 1. Pop Tracker
                embed.addFields({ name: '👥 Population', value: `${info.players}/${info.maxPlayers} (Queue: ${info.queuedPlayers})`, inline: true });
                // 2. Time Tracker
                const timeStatus = isNight ? `🌙 Night (${timeUntilDay}m to Day)` : `☀️ Day (${timeUntilNight}m to Night)`;
                embed.addFields({ name: '⏰ Game Time', value: `${timeString} - ${timeStatus}`, inline: true });
                // 3. Vending Tracker (Simplified, maybe count total active machines)
                const markers = await instance.client.getMapMarkers();
                const vendingCount = markers.filter((m) => m.type === 'VendingMachine').length;
                embed.addFields({ name: '🛒 Vending Machines', value: `${vendingCount} Active`, inline: true });
                // 4. Server Events (Last 3)
                const recentEvents = await client_1.prisma.serverEvent.findMany({
                    where: { serverId: server.id },
                    orderBy: { createdAt: 'desc' },
                    take: 3
                });
                let eventStr = recentEvents.length > 0
                    ? recentEvents.map((e) => `- ${e.type} (${Math.floor((Date.now() - e.createdAt.getTime()) / 60000)}m ago)`).join('\n')
                    : 'No recent events';
                embed.addFields({ name: '🔔 Recent Events', value: eventStr, inline: false });
            }
            catch (e) {
                embed.setColor(0xFFA500).setDescription('Failed to fetch data from Rust server.');
            }
        }
        const msgId = this.trackerMessages.get(server.id);
        if (msgId) {
            try {
                const message = await channel.messages.fetch(msgId);
                if (message) {
                    await message.edit({ embeds: [embed] });
                    return;
                }
            }
            catch (e) {
                // Message might have been deleted
                this.trackerMessages.delete(server.id);
            }
        }
        // Send new message
        const newMsg = await channel.send({ embeds: [embed] });
        this.trackerMessages.set(server.id, newMsg.id);
    }
}
exports.TrackerManager = TrackerManager;
exports.trackerManager = new TrackerManager();
