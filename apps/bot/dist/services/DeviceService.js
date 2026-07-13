"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceService = exports.DeviceService = void 0;
const client_1 = require("../database/client");
class DeviceService {
    async registerDevice(serverId, entityId, name, type) {
        return await client_1.prisma.device.upsert({
            where: { serverId_entityId: { serverId, entityId } },
            update: { name, type },
            create: { serverId, entityId, name, type, isActive: false }
        });
    }
    async getDevices(serverId) {
        return await client_1.prisma.device.findMany({ where: { serverId } });
    }
    async deleteDevice(serverId, entityId) {
        return await client_1.prisma.device.delete({
            where: { serverId_entityId: { serverId, entityId } }
        });
    }
}
exports.DeviceService = DeviceService;
exports.deviceService = new DeviceService();
