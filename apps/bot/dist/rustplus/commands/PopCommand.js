"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopCommand = void 0;
class PopCommand {
    name = 'pop';
    aliases = ['population', 'players'];
    description = 'Shows current server population and queue';
    usage = '!pop';
    cooldown = 5;
    async execute(ctx) {
        const info = await ctx.rustplus.getServerInfo();
        return `👥 Players: ${info.players}/${info.maxPlayers} ${info.queuedPlayers > 0 ? `(Queue: ${info.queuedPlayers})` : ''}`;
    }
}
exports.PopCommand = PopCommand;
