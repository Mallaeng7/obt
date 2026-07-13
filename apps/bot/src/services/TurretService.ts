import { prisma } from '../database/client';
import { CONSTANTS } from '../config/constants';

export class TurretService {
  async addTurret(serverId: string, x: number, y: number, floor: number, label?: string) {
    return await prisma.turretPosition.create({
      data: { serverId, x, y, floor, label }
    });
  }

  async checkInterference(serverId: string, x: number, y: number) {
    const turrets = await prisma.turretPosition.findMany({ where: { serverId } });
    
    // Simple 2D distance check
    let count = 0;
    for (const t of turrets) {
      const dist = Math.sqrt(Math.pow(t.x - x, 2) + Math.pow(t.y - y, 2));
      if (dist <= CONSTANTS.TURRET_INTERFERENCE_RADIUS) {
        count++;
      }
    }
    return count;
  }
}

export const turretService = new TurretService();
