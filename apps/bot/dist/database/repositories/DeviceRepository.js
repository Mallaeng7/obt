"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceRepository = exports.DeviceRepository = void 0;
const client_1 = require("../client");
class DeviceRepository {
    async findByServer(serverId) {
        return await client_1.prisma.device.findMany({ where: { serverId } });
    }
    async upsert(serverId, entityId, name, type) {
        return await client_1.prisma.device.upsert({
            where: { serverId_entityId: { serverId, entityId } },
            update: { name, type },
            create: { serverId, entityId, name, type, isActive: false }
        });
    }
}
exports.DeviceRepository = DeviceRepository;
exports.deviceRepository = new DeviceRepository();
