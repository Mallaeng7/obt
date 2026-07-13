import { prisma } from '../database/client';

export class DeviceService {
  async registerDevice(serverId: string, entityId: number, name: string, type: string) {
    return await prisma.device.upsert({
      where: { serverId_entityId: { serverId, entityId } },
      update: { name, type },
      create: { serverId, entityId, name, type, isActive: false }
    });
  }

  async getDevices(serverId: string) {
    return await prisma.device.findMany({ where: { serverId } });
  }

  async deleteDevice(serverId: string, entityId: number) {
    return await prisma.device.delete({
      where: { serverId_entityId: { serverId, entityId } }
    });
  }
}

export const deviceService = new DeviceService();
