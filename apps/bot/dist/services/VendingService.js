"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendingService = exports.VendingService = void 0;
const client_1 = require("../database/client");
class VendingService {
    async addWatchItem(serverId, steamId, itemName) {
        return await client_1.prisma.watchItem.create({
            data: { serverId, requestedBy: steamId, itemName }
        });
    }
    async getWatchItems(serverId) {
        return await client_1.prisma.watchItem.findMany({ where: { serverId, isActive: true } });
    }
    async updateVendingItems(serverId, items) {
        // Basic bulk insert placeholder
        for (const item of items) {
            await client_1.prisma.vendingItem.create({
                data: {
                    serverId,
                    itemName: item.name,
                    quantity: item.amount,
                    costItem: item.costName,
                    costAmount: item.costAmount,
                    x: item.x,
                    y: item.y
                }
            });
        }
    }
}
exports.VendingService = VendingService;
exports.vendingService = new VendingService();
