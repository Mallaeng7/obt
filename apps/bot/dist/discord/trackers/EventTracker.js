"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventTracker = void 0;
const RustPlusManager_1 = require("../../core/RustPlusManager");
const EventEmbed_1 = require("../embeds/EventEmbed");
const constants_1 = require("../../config/constants");
class EventTracker {
    client;
    channelId;
    messageId;
    constructor(client, channelId) {
        this.client = client;
        this.channelId = channelId;
    }
    async start() {
        setInterval(() => this.update(), constants_1.CONSTANTS.POLLING_INTERVALS.EVENT_TRACKER);
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
            const markers = await server.client.getMapMarkers();
            const heli = markers.some((m) => m.type === constants_1.CONSTANTS.EVENT_TYPES.HELI) ? 'Active' : 'Inactive';
            const cargo = markers.some((m) => m.type === constants_1.CONSTANTS.EVENT_TYPES.CARGO) ? 'Active' : 'Inactive';
            const crate = markers.some((m) => m.type === constants_1.CONSTANTS.EVENT_TYPES.LOCKED_CRATE) ? 'Active' : 'Inactive';
            const rig = markers.some((m) => m.type && String(m.type).toLowerCase().includes('oil_rig')) ? 'Active' : 'Inactive';
            const embed = new EventEmbed_1.EventEmbed(heli, cargo, crate, rig);
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
            console.error('[EventTracker] Failed to update:', e);
        }
    }
}
exports.EventTracker = EventTracker;
