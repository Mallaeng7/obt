"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventRepository = exports.EventRepository = void 0;
const client_1 = require("../client");
class EventRepository {
    async create(serverId, type, x, y) {
        return await client_1.prisma.serverEvent.create({
            data: { serverId, type, x, y }
        });
    }
    async findRecent(serverId, limit = 50) {
        return await client_1.prisma.serverEvent.findMany({
            where: { serverId },
            orderBy: { createdAt: 'desc' },
            take: limit
        });
    }
}
exports.EventRepository = EventRepository;
exports.eventRepository = new EventRepository();
