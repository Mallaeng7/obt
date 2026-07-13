"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapService = exports.MapService = void 0;
const client_1 = require("../database/client");
class MapService {
    async saveNote(serverId, x, y, label, color) {
        return await client_1.prisma.mapNote.create({
            data: { serverId, x, y, label, color }
        });
    }
    async getNotes(serverId) {
        return await client_1.prisma.mapNote.findMany({ where: { serverId } });
    }
    async deleteNote(noteId) {
        return await client_1.prisma.mapNote.delete({ where: { id: noteId } });
    }
}
exports.MapService = MapService;
exports.mapService = new MapService();
