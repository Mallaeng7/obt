import { FastifyInstance } from 'fastify';
import { prisma } from '../../database/client';

export async function settingsRoutes(fastify: FastifyInstance) {
  fastify.get('/credentials', async () => {
    const config = await prisma.appConfig.findFirst();
    return {
      hasSteamKey: !!config?.steamKey,
      hasDiscordToken: !!config?.discordToken,
      hasFcmCreds: !!config?.fcmCreds,
      discordAppId: config?.discordAppId
    };
  });

  fastify.put('/credentials', async (request: any) => {
    // Encrypt and store logic would go here
    const data = request.body;
    const existing = await prisma.appConfig.findFirst();
    if (existing) {
      return await prisma.appConfig.update({ where: { id: existing.id }, data });
    }
    return await prisma.appConfig.create({ data });
  });
}
