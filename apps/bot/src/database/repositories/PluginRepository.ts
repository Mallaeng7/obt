import { prisma } from '../client';

export class PluginRepository {
  async findByServer(serverId: string) {
    return await prisma.serverPlugin.findMany({ where: { serverId } });
  }

  async create(data: any) {
    return await prisma.serverPlugin.create({ data });
  }

  async delete(id: string) {
    return await prisma.serverPlugin.delete({ where: { id } });
  }
}

export const pluginRepository = new PluginRepository();
