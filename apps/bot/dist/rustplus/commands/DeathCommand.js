"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeathCommand = void 0;
const client_1 = require("../../database/client");
const grid_1 = require("../../utils/grid");
class DeathCommand {
    name = 'death';
    aliases = ['death2', 'deathpin'];
    description = 'Shows information about a recent death';
    usage = '!death <name>';
    cooldown = 5;
    async execute(ctx) {
        const cmd = ctx.args[0].toLowerCase();
        const name = ctx.args.length > 1 ? ctx.args.slice(1).join(' ') : ctx.senderName;
        const member = await client_1.prisma.teamMember.findFirst({
            where: { serverId: ctx.serverId, name: { contains: name, mode: 'insensitive' } },
            include: { deaths: { orderBy: { createdAt: 'desc' }, take: 2 } }
        });
        if (!member || member.deaths.length === 0) {
            return `❌ No death records found for '${name}'.`;
        }
        const isDeath2 = cmd === 'death2';
        const death = isDeath2 ? member.deaths[1] : member.deaths[0];
        if (!death) {
            return `❌ No second death record found for '${name}'.`;
        }
        const mins = Math.floor((Date.now() - death.createdAt.getTime()) / 60000);
        const killerStr = death.killerName ? ` by ${death.killerName}` : '';
        // Find current user's location to calculate distance
        let distanceStr = '';
        try {
            const team = await ctx.rustplus.getTeamInfo();
            const me = team.members.find((m) => m.steamId === ctx.senderSteamId);
            if (me && me.x !== undefined && me.y !== undefined) {
                const dist = Math.round((0, grid_1.calculateDistance)(me.x, me.y, death.x, death.y));
                const dir = (0, grid_1.formatDirection)(me.x, me.y, death.x, death.y);
                distanceStr = ` (${dist}m ${dir})`;
            }
        }
        catch (e) { }
        if (cmd === 'deathpin') {
            await client_1.prisma.mapNote.create({
                data: {
                    label: `${member.name} Death`,
                    x: death.x,
                    y: death.y,
                    color: '#FF0000',
                    serverId: ctx.serverId,
                    createdBy: ctx.senderSteamId
                }
            });
            return `📍 Pinned ${member.name}'s death location at [${Math.round(death.x)}, ${Math.round(death.y)}] to the map.`;
        }
        return `💀 ${member.name} died ${mins}m ago${killerStr} at [${Math.round(death.x)}, ${Math.round(death.y)}]${distanceStr}.`;
    }
}
exports.DeathCommand = DeathCommand;
