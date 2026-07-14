import { FastifyInstance } from 'fastify';
import { prisma } from '../../database/client';
import { rustPlusManager } from '../../core/RustPlusManager';

export async function dashboardRoutes(fastify: FastifyInstance) {
  fastify.get('/overview', async (_req, reply) => {
    try {
      // 서버 목록 조회
      const servers = await prisma.server.findMany({
        where: { isActive: true },
        select: { id: true, name: true, ip: true, appPort: true, isActive: true }
      });

      // 각 서버의 실시간 정보 조회 (연결된 경우)
      const serversWithInfo = await Promise.all(
        servers.map(async (server) => {
          const instance = rustPlusManager.getServer(server.id);
          let players = 0, maxPlayers = 0, queuedPlayers = 0;
          const isConnected = !!instance;

          if (instance) {
            try {
              const info = await Promise.race([
                instance.client.getServerInfo(),
                new Promise<null>((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
              ]);
              if (info) {
                players = (info as any).players ?? 0;
                maxPlayers = (info as any).maxPlayers ?? 0;
                queuedPlayers = (info as any).queuedPlayers ?? 0;
              }
            } catch { /* timeout or connection error */ }
          }

          return { ...server, isConnected, players, maxPlayers, queuedPlayers };
        })
      );

      // 팀원 목록 (첫 번째 서버 기준)
      const firstServerId = servers[0]?.id;
      const teamMembers = firstServerId
        ? await prisma.teamMember.findMany({
            where: { serverId: firstServerId },
            select: { id: true, name: true, isOnline: true, x: true, y: true },
            orderBy: { isOnline: 'desc' },
          })
        : [];

      // 활성 디바이스 수
      const activeDeviceCount = await prisma.device.count({
        where: { isActive: true, ...(firstServerId ? { serverId: firstServerId } : {}) }
      });

      // 최근 이벤트 (24시간)
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentEvents = firstServerId
        ? await prisma.serverEvent.findMany({
            where: { serverId: firstServerId, createdAt: { gte: since } },
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: { type: true, createdAt: true },
          })
        : [];

      return reply.send({
        servers: serversWithInfo,
        teamMembers,
        activeDeviceCount,
        recentEvents,
      });
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Failed to fetch dashboard data' });
    }
  });
}
