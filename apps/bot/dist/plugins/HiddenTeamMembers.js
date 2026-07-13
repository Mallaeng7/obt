"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HiddenTeamMembersPlugin = void 0;
exports.HiddenTeamMembersPlugin = {
    id: 'hidden-team-members',
    name: 'Hidden Team Members',
    description: 'Hides specific team members from the map when they type !hidden',
    onLoad: (ctx) => {
        ctx.onEvent('chat:message', async (serverId, msg) => {
            if (serverId !== ctx.serverId)
                return;
            if (msg.message === '!hidden') {
                ctx.storage.set(`hidden_${msg.steamId}`, true);
                await ctx.rustplus.sendTeamMessage(`${msg.name} is now hidden from the bot's map.`);
            }
        });
    },
    onUnload: () => {
        // Cleanup
    }
};
