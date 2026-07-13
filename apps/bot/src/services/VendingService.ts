import { prisma } from '../database/client';

export class VendingService {
  async addWatchItem(serverId: string, steamId: string, itemName: string) {
    return await prisma.watchItem.create({
      data: { serverId, requestedBy: steamId, itemName }
    });
  }

  async getWatchItems(serverId: string) {
    return await prisma.watchItem.findMany({ where: { serverId, isActive: true } });
  }

  async updateVendingItems(serverId: string, items: any[]) {
    // Basic bulk insert placeholder
    for (const item of items) {
      await prisma.vendingItem.create({
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

export const vendingService = new VendingService();
