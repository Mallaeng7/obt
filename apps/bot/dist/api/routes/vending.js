"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendingRoutes = vendingRoutes;
const VendingService_1 = require("../../services/VendingService");
const client_1 = require("../../database/client");
async function vendingRoutes(fastify) {
    fastify.get('/', async (request) => {
        const { id } = request.params;
        return await client_1.prisma.vendingItem.findMany({ where: { serverId: id } });
    });
    fastify.get('/watch', async (request) => {
        const { id } = request.params;
        return await VendingService_1.vendingService.getWatchItems(id);
    });
    fastify.post('/watch', async (request) => {
        const { id } = request.params;
        const { itemName, steamId } = request.body;
        return await VendingService_1.vendingService.addWatchItem(id, steamId, itemName);
    });
}
