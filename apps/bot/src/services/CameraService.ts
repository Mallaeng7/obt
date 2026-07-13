import { prisma } from '../database/client';

export class CameraService {
  async registerCamera(serverId: string, identifier: string, name: string, type: string) {
    return await prisma.camera.upsert({
      where: { serverId_identifier: { serverId, identifier } },
      update: { name, type },
      create: { serverId, identifier, name, type }
    });
  }

  async getCameras(serverId: string) {
    return await prisma.camera.findMany({ where: { serverId } });
  }

  async deleteCamera(serverId: string, identifier: string) {
    return await prisma.camera.delete({
      where: { serverId_identifier: { serverId, identifier } }
    });
  }
}

export const cameraService = new CameraService();
