"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.turretService = exports.TurretService = void 0;
const client_1 = require("../database/client");
const constants_1 = require("../config/constants");
class TurretService {
    async addTurret(serverId, x, y, floor, label) {
        return await client_1.prisma.turretPosition.create({
            data: { serverId, x, y, floor, label }
        });
    }
    async checkInterference(serverId, x, y) {
        const turrets = await client_1.prisma.turretPosition.findMany({ where: { serverId } });
        // Simple 2D distance check
        let count = 0;
        for (const t of turrets) {
            const dist = Math.sqrt(Math.pow(t.x - x, 2) + Math.pow(t.y - y, 2));
            if (dist <= constants_1.CONSTANTS.TURRET_INTERFERENCE_RADIUS) {
                count++;
            }
        }
        return count;
    }
}
exports.TurretService = TurretService;
exports.turretService = new TurretService();
