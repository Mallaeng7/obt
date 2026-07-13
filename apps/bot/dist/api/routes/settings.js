"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsRoutes = settingsRoutes;
const client_1 = require("../../database/client");
async function settingsRoutes(fastify) {
    fastify.get('/credentials', async () => {
        const config = await client_1.prisma.appConfig.findFirst();
        return {
            hasSteamKey: !!config?.steamKey,
            hasDiscordToken: !!config?.discordToken,
            hasFcmCreds: !!config?.fcmCreds,
            discordAppId: config?.discordAppId
        };
    });
    fastify.put('/credentials', async (request) => {
        // Encrypt and store logic would go here
        const data = request.body;
        const existing = await client_1.prisma.appConfig.findFirst();
        if (existing) {
            return await client_1.prisma.appConfig.update({ where: { id: existing.id }, data });
        }
        return await client_1.prisma.appConfig.create({ data });
    });
}
