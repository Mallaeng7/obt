"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsCommand = void 0;
const client_1 = require("../../database/client");
class EventsCommand {
    name = 'events';
    aliases = ['event'];
    description = 'Shows recently occurred server events';
    usage = '!events';
    cooldown = 10;
    async execute(ctx) {
        const events = await client_1.prisma.serverEvent.findMany({
            where: { serverId: ctx.serverId },
            orderBy: { createdAt: 'desc' },
            distinct: ['type'],
            take: 5
        });
        if (events.length === 0)
            return 'No recent events recorded.';
        const lines = events.map((e) => {
            const mins = Math.floor((Date.now() - e.createdAt.getTime()) / 60000);
            const icon = this.getIcon(e.type);
            return `${icon} ${e.type}: ${mins} mins ago`;
        });
        return `Recent Events:\n${lines.join('\n')}`;
    }
    getIcon(type) {
        const icons = {
            'heli': '🚁',
            'cargo': '🚢',
            'chinook': '🚁',
            'locked_crate': '📦',
            'oil_rig_small': '🛢️',
            'oil_rig_large': '🛢️',
            'deep_sea': '🌊'
        };
        return icons[type] || '✨';
    }
}
exports.EventsCommand = EventsCommand;
