"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerRepository = exports.PlayerRepository = void 0;
const client_1 = require("../client");
class PlayerRepository {
    async upsertLocation(serverId, steamId, data) {
        return await client_1.prisma.teamMember.upsert({
            where: { serverId_steamId: { serverId, steamId } },
            update: data,
            create: { serverId, steamId, ...data }
        });
    }
}
exports.PlayerRepository = PlayerRepository;
exports.playerRepository = new PlayerRepository();
