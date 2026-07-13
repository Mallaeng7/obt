import { prisma } from '../client';

export class DeviceRepository {
  async findByServer(serverId: string) {
    return await prisma.device.findMany({ where: { serverId } });
  }

  async upsert(serverId: string, entityId: number, name: string, type: string) {
    return await prisma.device.upsert({
      where: { serverId_entityId: { serverId, entityId } },
      update: { name, type },
      create: { serverId, entityId, name, type, isActive: false }
    });
  }
}

export const deviceRepository = new DeviceRepository();
