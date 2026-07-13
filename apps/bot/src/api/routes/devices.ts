import { FastifyInstance } from 'fastify';
import { deviceService } from '../../services/DeviceService';
import { rustPlusManager } from '../../core/RustPlusManager';

export async function devicesRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request: any) => {
    const { id } = request.params;
    return await deviceService.getDevices(id);
  });

  fastify.post('/:entityId/toggle', async (request: any) => {
    const { id, entityId } = request.params;
    const { value } = request.body as { value: boolean };
    const server = rustPlusManager.getServer(id);
    if (!server) throw new Error("Server not connected");
    await server.client.setEntityValue(Number(entityId), value);
    return { success: true };
  });
}
