import { FastifyInstance } from 'fastify';
import { rustPlusManager } from '../../core/RustPlusManager';

export async function mapRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request: any) => {
    const { id } = request.params;
    const server = rustPlusManager.getServer(id);
    if (!server) throw new Error("Server not connected");
    const mapData = await server.client.getMap();
    if (mapData && mapData.jpgImage) {
      return { image: `data:image/jpeg;base64,${mapData.jpgImage.toString('base64')}` };
    }
    return { image: null };
  });

  fastify.get('/markers', async (request: any) => {
    const { id } = request.params;
    const server = rustPlusManager.getServer(id);
    if (!server) throw new Error("Server not connected");
    return await server.client.getMapMarkers();
  });
}
