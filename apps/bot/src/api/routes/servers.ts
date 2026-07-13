import { FastifyInstance } from 'fastify';
import { prisma } from '../../database/client';
import { rustPlusManager } from '../../core/RustPlusManager';

export async function serversRoutes(fastify: FastifyInstance) {
  fastify.get('/', async () => {
    const servers = await prisma.server.findMany();
    return servers.map((s: any) => ({
      id: s.id,
      name: s.name,
      isActive: s.isActive,
      connected: !!rustPlusManager.getServer(s.id)
    }));
  });

  fastify.post('/', async (request: any) => {
    const { name, ip, port, appPort, steamId, playerToken } = request.body;
    return await prisma.server.create({
      data: { name, ip, port, appPort, steamId, playerToken, isActive: true }
    });
  });

  fastify.delete('/:id', async (request: any) => {
    const { id } = request.params;
    rustPlusManager.removeServer(id);
    await prisma.server.delete({ where: { id } });
    return { success: true };
  });
}
