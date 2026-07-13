import { FastifyInstance } from 'fastify';
import { playerService } from '../../services/PlayerService';

export async function playersRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request: any) => {
    const { id } = request.params;
    return await playerService.getTeamMembers(id);
  });
}
