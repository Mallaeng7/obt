"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerInfoTracker = void 0;
const RustPlusManager_1 = require("../../core/RustPlusManager");
const ServerInfoEmbed_1 = require("../embeds/ServerInfoEmbed");
const constants_1 = require("../../config/constants");
class ServerInfoTracker {
    client;
    channelId;
    messageId;
    constructor(client, channelId) {
        this.client = client;
        this.channelId = channelId;
    }
    async start() {
        setInterval(() => this.update(), constants_1.CONSTANTS.POLLING_INTERVALS.SERVER_INFO_TRACKER);
        await this.update();
    }
    async update() {
        // Logic to update Server Info embed
        const channel = await this.client.channels.fetch(this.channelId);
        if (!channel)
            return;
        // Example logic using the first active server
        const server = RustPlusManager_1.rustPlusManager.getAllServers()[0];
        if (!server)
            return;
        try {
            const info = await server.client.getServerInfo();
            const time = await server.client.getTime();
            const embed = new ServerInfoEmbed_1.ServerInfoEmbed(info.name, info.players, info.maxPlayers, time.time, info.mapSize, info.seed);
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
            console.error('[ServerInfoTracker] Failed to update:', e);
        }
    }
}
exports.ServerInfoTracker = ServerInfoTracker;
