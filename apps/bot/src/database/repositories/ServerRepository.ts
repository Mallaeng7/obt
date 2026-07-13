import { prisma } from '../client';

export class ServerRepository {
  async findAllActive() {
    return await prisma.server.findMany({ where: { isActive: true } });
  }
  
  async create(data: any) {
    return await prisma.server.create({ data });
  }

  async delete(id: string) {
    return await prisma.server.delete({ where: { id } });
  }
}

export const serverRepository = new ServerRepository();
