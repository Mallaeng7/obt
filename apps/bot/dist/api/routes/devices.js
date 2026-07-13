"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.devicesRoutes = devicesRoutes;
const DeviceService_1 = require("../../services/DeviceService");
const RustPlusManager_1 = require("../../core/RustPlusManager");
async function devicesRoutes(fastify) {
    fastify.get('/', async (request) => {
        const { id } = request.params;
        return await DeviceService_1.deviceService.getDevices(id);
    });
    fastify.post('/:entityId/toggle', async (request) => {
        const { id, entityId } = request.params;
        const { value } = request.body;
        const server = RustPlusManager_1.rustPlusManager.getServer(id);
        if (!server)
            throw new Error("Server not connected");
        await server.client.setEntityValue(Number(entityId), value);
        return { success: true };
    });
}
