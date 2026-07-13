import { FastifyInstance } from 'fastify';
import { serversRoutes } from './servers';
import { settingsRoutes } from './settings';
import { devicesRoutes } from './devices';
import { mapRoutes } from './map';
import { playersRoutes } from './players';
import { eventsRoutes } from './events';
import { vendingRoutes } from './vending';
import { pluginsRoutes } from './plugins';

export async function apiRoutes(fastify: FastifyInstance) {
  fastify.get('/api/health', async () => ({ status: 'ok', time: new Date() }));
  
  await fastify.register(serversRoutes, { prefix: '/api/servers' });
  await fastify.register(settingsRoutes, { prefix: '/api/settings' });
  await fastify.register(devicesRoutes, { prefix: '/api/servers/:id/devices' });
  await fastify.register(mapRoutes, { prefix: '/api/servers/:id/map' });
  await fastify.register(playersRoutes, { prefix: '/api/servers/:id/team' });
  await fastify.register(eventsRoutes, { prefix: '/api/servers/:id/events' });
  await fastify.register(vendingRoutes, { prefix: '/api/servers/:id/vending' });
  await fastify.register(pluginsRoutes, { prefix: '/api/servers/:id/plugins' });
}
