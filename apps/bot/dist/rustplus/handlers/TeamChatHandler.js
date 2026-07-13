"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamChatHandler = exports.TeamChatHandler = void 0;
const EventEmitterHub_1 = require("../../core/EventEmitterHub");
const RustPlusManager_1 = require("../../core/RustPlusManager");
const CommandRouter_1 = require("../commands/CommandRouter");
class TeamChatHandler {
    constructor() {
        EventEmitterHub_1.events.on('team:chat', async (serverId, msg) => {
            // Ignore messages from the bot itself
            if (msg.name === 'RustPlusBot')
                return; // Or whatever name the bot uses
            if (msg.message.startsWith('!')) {
                const args = msg.message.substring(1).trim().split(/\s+/);
                const serverInstance = RustPlusManager_1.rustPlusManager.getServer(serverId);
                if (!serverInstance)
                    return;
                const ctx = {
                    serverId,
                    senderSteamId: msg.steamId,
                    senderName: msg.name,
                    args,
                    rustplus: serverInstance.client
                };
                const response = await CommandRouter_1.commandRouter.dispatch(ctx);
                if (response) {
                    await serverInstance.client.sendTeamMessage(response);
                }
            }
        });
    }
}
exports.TeamChatHandler = TeamChatHandler;
exports.teamChatHandler = new TeamChatHandler();
