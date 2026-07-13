import { FastifyInstance } from 'fastify';
import { prisma } from '../../database/client';
import { pluginSandbox } from '../../plugins/PluginSandbox';

export async function pluginsRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request: any) => {
    const { id } = request.params;
    return await prisma.serverPlugin.findMany({ where: { serverId: id } });
  });

  fastify.post('/', async (request: any) => {
    const { id } = request.params;
    const { name, description, code, trigger } = request.body;
    const plugin = await prisma.serverPlugin.create({
      data: { serverId: id, name, description, code, trigger, isActive: true }
    });
    await pluginSandbox.loadPlugin(plugin.id, code);
    return plugin;
  });

  fastify.delete('/:pluginId', async (request: any) => {
    const { pluginId } = request.params;
    pluginSandbox.unloadPlugin(pluginId);
    await prisma.serverPlugin.delete({ where: { id: pluginId } });
    return { success: true };
  });
}
