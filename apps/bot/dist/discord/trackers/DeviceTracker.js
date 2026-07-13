"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceTracker = void 0;
const DeviceEmbed_1 = require("../embeds/DeviceEmbed");
const constants_1 = require("../../config/constants");
class DeviceTracker {
    client;
    channelId;
    messageId;
    constructor(client, channelId) {
        this.client = client;
        this.channelId = channelId;
    }
    async start() {
        setInterval(() => this.update(), constants_1.CONSTANTS.POLLING_INTERVALS.DEVICE_TRACKER);
        await this.update();
    }
    async update() {
        const channel = await this.client.channels.fetch(this.channelId);
        if (!channel)
            return;
        try {
            const server = require('../../core/RustPlusManager').rustplusManager.getAllServers()[0];
            if (!server)
                return;
            const deviceRepository = require('../../database/repositories/DeviceRepository').deviceRepository;
            const devices = await deviceRepository.findByServer(server.id);
            const embed = new DeviceEmbed_1.DeviceEmbed(devices);
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
            console.error('[DeviceTracker] Failed to update:', e);
        }
    }
}
exports.DeviceTracker = DeviceTracker;
