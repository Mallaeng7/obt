export declare class PlayerService {
    updatePlayerLocation(serverId: string, steamId: string, name: string, x: number, y: number, isOnline: boolean): Promise<{
        name: string;
        id: string;
        x: number | null;
        y: number | null;
        serverId: string;
        steamId: string;
        createdAt: Date;
        updatedAt: Date;
        isOnline: boolean;
        isAlive: boolean;
        deathCount: number;
        playTime: number;
        afkTime: number;
        lastMoved: Date | null;
    }>;
    recordDeath(serverId: string, steamId: string, x: number, y: number): Promise<void>;
    getTeamMembers(serverId: string): Promise<{
        name: string;
        id: string;
        x: number | null;
        y: number | null;
        serverId: string;
        steamId: string;
        createdAt: Date;
        updatedAt: Date;
        isOnline: boolean;
        isAlive: boolean;
        deathCount: number;
        playTime: number;
        afkTime: number;
        lastMoved: Date | null;
    }[]>;
}
export declare const playerService: PlayerService;
//# sourceMappingURL=PlayerService.d.ts.map