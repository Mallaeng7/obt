"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TCUpkeepTracker = void 0;
const discord_js_1 = require("discord.js");
const RustPlusManager_1 = require("../../core/RustPlusManager");
const constants_1 = require("../../config/constants");
class TCUpkeepTracker {
    client;
    channelId;
    messageId;
    constructor(client, channelId) {
        this.client = client;
        this.channelId = channelId;
    }
    async start() {
        setInterval(() => this.update(), constants_1.CONSTANTS.POLLING_INTERVALS.TC_UPKEEP_TRACKER);
        await this.update();
    }
    async update() {
        const channel = await this.client.channels.fetch(this.channelId);
        if (!channel)
            return;
        try {
            const server = RustPlusManager_1.rustPlusManager.getAllServers()[0];
            if (!server)
                return;
            const deviceRepository = require('../../database/repositories/DeviceRepository').deviceRepository;
            const devices = await deviceRepository.findByServer(server.id);
            const tc = devices.find((d) => d.type === 'storage_monitor' || d.name.toLowerCase().includes('tc'));
            let upkeepText = 'Unknown';
            if (tc) {
                try {
                    const info = await server.client.getEntityInfo(tc.entityId);
                    upkeepText = info.capacity ? `${info.capacity} slots left` : 'Active';
                }
                catch (e) {
                    upkeepText = 'Failed to fetch';
                }
            }
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle('Tool Cupboard Upkeep')
                .setColor('#f1c40f')
                .setDescription(`Upkeep: ${upkeepText}`);
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
            console.error('[TCUpkeepTracker] Failed to update:', e);
        }
    }
}
exports.TCUpkeepTracker = TCUpkeepTracker;
