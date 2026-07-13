"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapRoutes = mapRoutes;
const RustPlusManager_1 = require("../../core/RustPlusManager");
async function mapRoutes(fastify) {
    fastify.get('/', async (request) => {
        const { id } = request.params;
        const server = RustPlusManager_1.rustPlusManager.getServer(id);
        if (!server)
            throw new Error("Server not connected");
        const mapData = await server.client.getMap();
        if (mapData && mapData.jpgImage) {
            return { image: `data:image/jpeg;base64,${mapData.jpgImage.toString('base64')}` };
        }
        return { image: null };
    });
    fastify.get('/markers', async (request) => {
        const { id } = request.params;
        const server = RustPlusManager_1.rustPlusManager.getServer(id);
        if (!server)
            throw new Error("Server not connected");
        return await server.client.getMapMarkers();
    });
}
