"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serversRoutes = serversRoutes;
const client_1 = require("../../database/client");
const RustPlusManager_1 = require("../../core/RustPlusManager");
async function serversRoutes(fastify) {
    fastify.get('/', async () => {
        const servers = await client_1.prisma.server.findMany();
        return servers.map((s) => ({
            id: s.id,
            name: s.name,
            isActive: s.isActive,
            connected: !!RustPlusManager_1.rustPlusManager.getServer(s.id)
        }));
    });
    fastify.post('/', async (request) => {
        const { name, ip, port, appPort, steamId, playerToken } = request.body;
        return await client_1.prisma.server.create({
            data: { name, ip, port, appPort, steamId, playerToken, isActive: true }
        });
    });
    fastify.delete('/:id', async (request) => {
        const { id } = request.params;
        RustPlusManager_1.rustPlusManager.removeServer(id);
        await client_1.prisma.server.delete({ where: { id } });
        return { success: true };
    });
}
