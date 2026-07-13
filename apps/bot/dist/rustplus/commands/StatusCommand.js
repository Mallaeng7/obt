"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCommand = void 0;
const client_1 = require("../../database/client");
class StatusCommand {
    name = 'status';
    aliases = ['st'];
    description = 'Shows status of a paired smart device';
    usage = '!status <device_name>';
    cooldown = 3;
    async execute(ctx) {
        if (ctx.args.length < 2)
            return '❌ Usage: !status <device_name>';
        const name = ctx.args.slice(1).join(' ');
        const device = await client_1.prisma.device.findFirst({
            where: { serverId: ctx.serverId, name: { contains: name, mode: 'insensitive' } }
        });
        if (!device)
            return `❌ Device '${name}' not found.`;
        try {
            const info = await ctx.rustplus.getEntityInfo(device.entityId);
            if (device.type === 'storage_monitor') {
                const capacity = info.payload?.capacity || 0;
                const protectionExpiry = info.payload?.protectionExpiry; // Assuming payload structure
                if (protectionExpiry) {
                    const timeRemaining = protectionExpiry - Date.now() / 1000;
                    if (timeRemaining > 0) {
                        const hours = Math.floor(timeRemaining / 3600);
                        return `🛡️ TC '${device.name}' Upkeep: ${hours} hours remaining.`;
                    }
                    return `⚠️ TC '${device.name}' is decaying!`;
                }
                return `📦 Storage '${device.name}' Capacity: ${capacity}`;
            }
            else {
                const isOn = info.payload?.value === true;
                return `🔌 Device '${device.name}' is currently ${isOn ? '🟢 ON' : '🔴 OFF'}.`;
            }
        }
        catch (e) {
            return `❌ Failed to get status for '${device.name}'. Is it still paired?`;
        }
    }
}
exports.StatusCommand = StatusCommand;
