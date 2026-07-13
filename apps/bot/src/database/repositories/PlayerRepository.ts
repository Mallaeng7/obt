import { prisma } from '../client';

export class PlayerRepository {
  async upsertLocation(serverId: string, steamId: string, data: any) {
    return await prisma.teamMember.upsert({
      where: { serverId_steamId: { serverId, steamId } },
      update: data,
      create: { serverId, steamId, ...data }
    });
  }
}

export const playerRepository = new PlayerRepository();
