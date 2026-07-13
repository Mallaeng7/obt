"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnOffCommand = void 0;
const client_1 = require("../../database/client");
class OnOffCommand {
    name = 'on'; // or 'off' depending on context, handled by router alias
    aliases = ['off', 'toggle'];
    description = 'Turns a paired smart switch on or off';
    usage = '!on <device_name>';
    cooldown = 2;
    async execute(ctx) {
        const cmd = ctx.args[0].toLowerCase();
        if (ctx.args.length < 2)
            return `❌ Usage: !${cmd} <device_name>`;
        const name = ctx.args.slice(1).join(' ');
        const device = await client_1.prisma.device.findFirst({
            where: { serverId: ctx.serverId, name: { contains: name, mode: 'insensitive' }, type: 'switch' }
        });
        if (!device)
            return `❌ Switch '${name}' not found.`;
        try {
            let turnOn = cmd === 'on';
            if (cmd === 'toggle') {
                const info = await ctx.rustplus.getEntityInfo(device.entityId);
                turnOn = !(info.payload?.value === true);
            }
            await ctx.rustplus.setEntityValue(device.entityId, turnOn);
            return `🔌 Turned ${turnOn ? '🟢 ON' : '🔴 OFF'} '${device.name}'.`;
        }
        catch (e) {
            return `❌ Failed to toggle '${device.name}'.`;
        }
    }
}
exports.OnOffCommand = OnOffCommand;
