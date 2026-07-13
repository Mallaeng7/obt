"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rustPlusManager = exports.RustPlusManager = void 0;
const ServerInstance_1 = require("./ServerInstance");
const client_1 = require("../database/client");
class RustPlusManager {
    instances = new Map();
    async initialize() {
        const servers = await client_1.prisma.server.findMany({ where: { isActive: true } });
        for (const server of servers) {
            await this.addServer(server.id, server.ip, server.appPort, server.steamId, server.playerToken);
        }
    }
    async addServer(id, ip, port, steamId, playerToken) {
        if (this.instances.has(id)) {
            this.removeServer(id);
        }
        const instance = new ServerInstance_1.ServerInstance(id, ip, port, steamId, playerToken);
        this.instances.set(id, instance);
        instance.connect();
    }
    removeServer(id) {
        const instance = this.instances.get(id);
        if (instance) {
            instance.disconnect();
            this.instances.delete(id);
        }
    }
    getServer(id) {
        return this.instances.get(id);
    }
    getAllServers() {
        return Array.from(this.instances.values());
    }
}
exports.RustPlusManager = RustPlusManager;
exports.rustPlusManager = new RustPlusManager();
