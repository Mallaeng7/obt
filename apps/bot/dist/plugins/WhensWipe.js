"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhensWipePlugin = void 0;
exports.WhensWipePlugin = {
    id: 'whens-wipe',
    name: 'When is Wipe',
    description: 'Replies with the wipe schedule. Usage: !wipe',
    onLoad: (ctx) => {
        ctx.onEvent('chat:message', async (serverId, msg) => {
            if (serverId !== ctx.serverId)
                return;
            if (msg.message === '!wipe') {
                const wipeDate = ctx.storage.get('wipe_date') || 'Unknown';
                await ctx.rustplus.sendTeamMessage(`Next wipe is scheduled for: ${wipeDate}. (Set via !setwipe [date])`);
            }
            else if (msg.message.startsWith('!setwipe ')) {
                const dateStr = msg.message.replace('!setwipe ', '');
                ctx.storage.set('wipe_date', dateStr);
                await ctx.rustplus.sendTeamMessage(`Wipe date updated to: ${dateStr}`);
            }
        });
    },
    onUnload: () => { }
};
