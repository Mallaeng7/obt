"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventsRoutes = eventsRoutes;
const client_1 = require("../../database/client");
async function eventsRoutes(fastify) {
    fastify.get('/', async (request) => {
        const { id } = request.params;
        return await client_1.prisma.serverEvent.findMany({
            where: { serverId: id },
            orderBy: { createdAt: 'desc' },
            take: 50
        });
    });
}
