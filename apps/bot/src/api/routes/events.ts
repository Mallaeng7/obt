import { FastifyInstance } from 'fastify';
import { prisma } from '../../database/client';

export async function eventsRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request: any) => {
    const { id } = request.params;
    return await prisma.serverEvent.findMany({
      where: { serverId: id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  });
}
