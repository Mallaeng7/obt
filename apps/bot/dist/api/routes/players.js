"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playersRoutes = playersRoutes;
const PlayerService_1 = require("../../services/PlayerService");
async function playersRoutes(fastify) {
    fastify.get('/', async (request) => {
        const { id } = request.params;
        return await PlayerService_1.playerService.getTeamMembers(id);
    });
}
