import { prisma } from '../client';

export class EventRepository {
  async create(serverId: string, type: string, x: number, y: number) {
    return await prisma.serverEvent.create({
      data: { serverId, type, x, y }
    });
  }

  async findRecent(serverId: string, limit: number = 50) {
    return await prisma.serverEvent.findMany({
      where: { serverId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }
}

export const eventRepository = new EventRepository();
