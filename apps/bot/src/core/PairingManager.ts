import { EventEmitter } from 'events';

export interface PendingPairing {
  ip: string;
  port: number;
  appPort: number;
  steamId: string;
  playerToken: string;
  serverName: string;
  timestamp: number;
}

class PairingManager extends EventEmitter {
  private pairings: Map<string, PendingPairing> = new Map();

  public addPairing(payload: any) {
    const ip = payload.ip;
    const port = parseInt(payload.port, 10);
    const key = `${ip}:${port}`;
    
    const pairing: PendingPairing = {
      ip,
      port,
      appPort: payload.appPort ? parseInt(payload.appPort, 10) : port + 67,
      steamId: payload.playerId || payload.steamId || '',
      playerToken: payload.playerToken || '',
      serverName: payload.name || payload.desc || `${ip}:${port}`,
      timestamp: Date.now()
    };

    this.pairings.set(key, pairing);
    this.emit('newPairing', pairing);
    return pairing;
  }

  public getPairings(): PendingPairing[] {
    return Array.from(this.pairings.values());
  }

  public removePairing(ip: string, port: number) {
    this.pairings.delete(`${ip}:${port}`);
  }
}

export const pairingManager = new PairingManager();
