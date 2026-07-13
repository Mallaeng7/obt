"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginsRoutes = pluginsRoutes;
const client_1 = require("../../database/client");
const PluginSandbox_1 = require("../../plugins/PluginSandbox");
async function pluginsRoutes(fastify) {
    fastify.get('/', async (request) => {
        const { id } = request.params;
        return await client_1.prisma.serverPlugin.findMany({ where: { serverId: id } });
    });
    fastify.post('/', async (request) => {
        const { id } = request.params;
        const { name, description, code, trigger } = request.body;
        const plugin = await client_1.prisma.serverPlugin.create({
            data: { serverId: id, name, description, code, trigger, isActive: true }
        });
        await PluginSandbox_1.pluginSandbox.loadPlugin(plugin.id, code);
        return plugin;
    });
    fastify.delete('/:pluginId', async (request) => {
        const { pluginId } = request.params;
        PluginSandbox_1.pluginSandbox.unloadPlugin(pluginId);
        await client_1.prisma.serverPlugin.delete({ where: { id: pluginId } });
        return { success: true };
    });
}
