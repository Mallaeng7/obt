"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cameraService = exports.CameraService = void 0;
const client_1 = require("../database/client");
class CameraService {
    async registerCamera(serverId, identifier, name, type) {
        return await client_1.prisma.camera.upsert({
            where: { serverId_identifier: { serverId, identifier } },
            update: { name, type },
            create: { serverId, identifier, name, type }
        });
    }
    async getCameras(serverId) {
        return await client_1.prisma.camera.findMany({ where: { serverId } });
    }
    async deleteCamera(serverId, identifier) {
        return await client_1.prisma.camera.delete({
            where: { serverId_identifier: { serverId, identifier } }
        });
    }
}
exports.CameraService = CameraService;
exports.cameraService = new CameraService();
