"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerService = exports.PlayerService = void 0;
const client_1 = require("../database/client");
class PlayerService {
    async updatePlayerLocation(serverId, steamId, name, x, y, isOnline) {
        return await client_1.prisma.teamMember.upsert({
            where: { serverId_steamId: { serverId, steamId } },
            update: { name, x, y, isOnline, lastMoved: new Date() },
            create: { serverId, steamId, name, x, y, isOnline }
        });
    }
    async recordDeath(serverId, steamId, x, y) {
        const member = await client_1.prisma.teamMember.findUnique({ where: { serverId_steamId: { serverId, steamId } } });
        if (!member)
            return;
        await client_1.prisma.deathLocation.create({
            data: { teamMemberId: member.id, x, y }
        });
        await client_1.prisma.teamMember.update({
            where: { id: member.id },
            data: { deathCount: { increment: 1 } }
        });
    }
    async getTeamMembers(serverId) {
        return await client_1.prisma.teamMember.findMany({ where: { serverId } });
    }
}
exports.PlayerService = PlayerService;
exports.playerService = new PlayerService();
