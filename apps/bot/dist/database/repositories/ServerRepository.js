"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverRepository = exports.ServerRepository = void 0;
const client_1 = require("../client");
class ServerRepository {
    async findAllActive() {
        return await client_1.prisma.server.findMany({ where: { isActive: true } });
    }
    async create(data) {
        return await client_1.prisma.server.create({ data });
    }
    async delete(id) {
        return await client_1.prisma.server.delete({ where: { id } });
    }
}
exports.ServerRepository = ServerRepository;
exports.serverRepository = new ServerRepository();
