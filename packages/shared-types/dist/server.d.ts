export interface ServerConfig {
    id: string;
    name: string;
    ip: string;
    port: number;
    appPort: number;
    steamId: string;
    playerToken: string;
    isActive: boolean;
}
export interface ServerInfo {
    name: string;
    players: number;
    maxPlayers: number;
    queueSize: number;
    mapSize: number;
    seed: number;
    wipeDate?: Date;
}
//# sourceMappingURL=server.d.ts.map