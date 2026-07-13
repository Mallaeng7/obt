"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DurabilityCommand = void 0;
const rust_data_1 = require("@obt/rust-data");
class DurabilityCommand {
    name = 'durability';
    aliases = ['raid', 'cost'];
    description = 'Shows raid costs for a building block or item';
    usage = '!durability <target>';
    cooldown = 5;
    async execute(ctx) {
        if (ctx.args.length < 2)
            return '❌ Usage: !durability <target>';
        const targetName = ctx.args.slice(1).join(' ');
        const building = (0, rust_data_1.getBuilding)(targetName);
        if (!building)
            return `❌ Target '${targetName}' not found.`;
        const raidCosts = (0, rust_data_1.getRaidCosts)();
        const costs = raidCosts[building.name];
        if (!costs)
            return `❌ No raid data for '${building.name}'.`;
        const lines = costs.map((c) => `- ${c.amount}x ${c.weapon} (${c.sulfur} sulfur)`);
        return `💥 Raid costs for ${building.name} (${building.hp} HP):\n${lines.join('\n')}`;
    }
}
exports.DurabilityCommand = DurabilityCommand;
