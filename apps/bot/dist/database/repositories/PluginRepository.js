"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginRepository = exports.PluginRepository = void 0;
const client_1 = require("../client");
class PluginRepository {
    async findByServer(serverId) {
        return await client_1.prisma.serverPlugin.findMany({ where: { serverId } });
    }
    async create(data) {
        return await client_1.prisma.serverPlugin.create({ data });
    }
    async delete(id) {
        return await client_1.prisma.serverPlugin.delete({ where: { id } });
    }
}
exports.PluginRepository = PluginRepository;
exports.pluginRepository = new PluginRepository();
