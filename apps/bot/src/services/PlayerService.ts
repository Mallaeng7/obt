import { prisma } from '../database/client';

export class PlayerService {
  async updatePlayerLocation(serverId: string, steamId: string, name: string, x: number, y: number, isOnline: boolean) {
    return await prisma.teamMember.upsert({
      where: { serverId_steamId: { serverId, steamId } },
      update: { name, x, y, isOnline, lastMoved: new Date() },
      create: { serverId, steamId, name, x, y, isOnline }
    });
  }

  async recordDeath(serverId: string, steamId: string, x: number, y: number) {
    const member = await prisma.teamMember.findUnique({ where: { serverId_steamId: { serverId, steamId } } });
    if (!member) return;
    
    await prisma.deathLocation.create({
      data: { teamMemberId: member.id, x, y }
    });
    
    await prisma.teamMember.update({
      where: { id: member.id },
      data: { deathCount: { increment: 1 } }
    });
  }

  async getTeamMembers(serverId: string) {
    return await prisma.teamMember.findMany({ where: { serverId } });
  }
}

export const playerService = new PlayerService();
