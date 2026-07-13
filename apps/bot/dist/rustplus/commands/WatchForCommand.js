"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchForCommand = void 0;
const client_1 = require("../../database/client");
class WatchForCommand {
    name = 'watchfor';
    aliases = ['watch'];
    description = 'Receive a notification when an item is added to a vending machine';
    usage = '!watchfor <item_name>';
    cooldown = 5;
    async execute(ctx) {
        if (ctx.args.length < 2)
            return '❌ Usage: !watchfor <item_name>';
        const search = ctx.args.slice(1).join(' ').toLowerCase();
        await client_1.prisma.watchItem.create({
            data: {
                itemName: search,
                requestedBy: ctx.senderSteamId,
                serverId: ctx.serverId
            }
        });
        return `👀 Now watching for vending machines selling '${search}'.`;
    }
}
exports.WatchForCommand = WatchForCommand;
