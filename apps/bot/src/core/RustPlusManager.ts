import { ServerInstance } from './ServerInstance';
import { prisma } from '../database/client';

export class RustPlusManager {
  private instances: Map<string, ServerInstance> = new Map();

  public async initialize() {
    const servers = await prisma.server.findMany({ where: { isActive: true } });
    for (const server of servers) {
      await this.addServer(server.id, server.ip, server.appPort, server.steamId, server.playerToken);
    }
  }

  public async addServer(id: string, ip: string, port: number, steamId: string, playerToken: string) {
    if (this.instances.has(id)) {
      this.removeServer(id);
    }
    const instance = new ServerInstance(id, ip, port, steamId, playerToken);
    this.instances.set(id, instance);
    instance.connect();
  }

  public removeServer(id: string) {
    const instance = this.instances.get(id);
    if (instance) {
      instance.disconnect();
      this.instances.delete(id);
    }
  }

  public getServer(id: string): ServerInstance | undefined {
    return this.instances.get(id);
  }

  public getAllServers(): ServerInstance[] {
    return Array.from(this.instances.values());
  }
}

export const rustPlusManager = new RustPlusManager();
