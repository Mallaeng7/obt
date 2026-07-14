import { FastifyInstance } from 'fastify';
import { prisma } from '../../database/client';
import { rustPlusManager } from '../../core/RustPlusManager';

export async function serversRoutes(fastify: FastifyInstance) {
  // 서버 목록
  fastify.get('/', async () => {
    const servers = await prisma.server.findMany({ where: { isActive: true } });
    return servers.map((s: any) => ({
      id: s.id,
      name: s.name,
      ip: s.ip,
      appPort: s.appPort,
      isActive: s.isActive,
      connected: !!rustPlusManager.getServer(s.id),
    }));
  });

  // 서버 등록
  fastify.post('/', async (request: any) => {
    const { name, ip, port, appPort, steamId, playerToken } = request.body;
    return await prisma.server.create({
      data: { name, ip, port, appPort, steamId, playerToken, isActive: true },
    });
  });

  // 서버 설정 업데이트 (alertChannelId 등)
  fastify.patch('/:id', async (request: any) => {
    const { id } = request.params;
    const { alertChannelId, trackerChannelId, name, pollingInterval } = request.body;
    const data: any = {};
    if (alertChannelId !== undefined) data.alertChannelId = alertChannelId;
    if (trackerChannelId !== undefined) data.trackerChannelId = trackerChannelId;
    if (name !== undefined) data.name = name;
    if (pollingInterval !== undefined) data.pollingInterval = pollingInterval;
    return await prisma.server.update({ where: { id }, data });
  });

  // 페어링 요청 목록 조회
  fastify.get('/pending', async () => {
    const { pairingManager } = await import('../../core/PairingManager');
    return pairingManager.getPairings();
  });

  // 페어링 요청 수락 및 서버 등록
  fastify.post('/pair', async (request: any, reply: any) => {
    const { ip, port, appPort, steamId, playerToken, serverName } = request.body;
    let server = await prisma.server.findFirst({ where: { ip, port } });

    if (!server) {
      server = await prisma.server.create({
        data: {
          name: serverName || `${ip}:${port}`,
          ip,
          port,
          appPort,
          steamId,
          playerToken,
          isActive: true,
        },
      });
    }

    if (server) {
      await rustPlusManager.addServer(server.id, server.ip, server.appPort, server.steamId, server.playerToken);
      
      const { notificationService } = await import('../../services/NotificationService');
      await notificationService.markServerConnectedInDiscord(ip, port, server.name);
      
      const { pairingManager } = await import('../../core/PairingManager');
      pairingManager.removePairing(ip, port);
      
      return server;
    }
    
    return reply.status(500).send({ error: 'Failed to pair server' });
  });

  // 서버 삭제 (연결 해제)
  fastify.delete('/:id', async (request: any) => {
    const { id } = request.params;
    rustPlusManager.removeServer(id);
    await prisma.server.delete({ where: { id } });
    return { success: true };
  });
}
