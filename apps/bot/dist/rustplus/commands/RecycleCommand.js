"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecycleCommand = void 0;
const rust_data_1 = require("@obt/rust-data");
class RecycleCommand {
    name = 'recycle';
    aliases = ['rec'];
    description = 'Calculates recycling output';
    usage = '!recycle <amount> <item_name>';
    cooldown = 3;
    async execute(ctx) {
        if (ctx.args.length < 3)
            return '❌ Usage: !recycle <amount> <item_name>';
        const amount = parseInt(ctx.args[1], 10);
        if (isNaN(amount) || amount <= 0)
            return '❌ Invalid amount.';
        const itemName = ctx.args.slice(2).join(' ');
        const item = (0, rust_data_1.findItem)(itemName);
        if (!item)
            return `❌ Item '${itemName}' not found.`;
        const recycleData = (0, rust_data_1.getRecycleData)();
        const output = recycleData[item.name];
        if (!output)
            return `❌ '${item.displayName}' cannot be recycled.`;
        const resultStr = output.map((o) => `${o.amount * amount}x ${o.itemName}`).join(', ');
        return `♻️ Recycling ${amount}x ${item.displayName} yields: ${resultStr}`;
    }
}
exports.RecycleCommand = RecycleCommand;
