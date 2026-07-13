import { FastifyInstance } from 'fastify';
import { vendingService } from '../../services/VendingService';
import { prisma } from '../../database/client';

export async function vendingRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request: any) => {
    const { id } = request.params;
    return await prisma.vendingItem.findMany({ where: { serverId: id } });
  });

  fastify.get('/watch', async (request: any) => {
    const { id } = request.params;
    return await vendingService.getWatchItems(id);
  });

  fastify.post('/watch', async (request: any) => {
    const { id } = request.params;
    const { itemName, steamId } = request.body;
    return await vendingService.addWatchItem(id, steamId, itemName);
  });
}
