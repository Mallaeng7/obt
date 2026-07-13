export declare class PlayerRepository {
    upsertLocation(serverId: string, steamId: string, data: any): Promise<{
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
}
export declare const playerRepository: PlayerRepository;
//# sourceMappingURL=PlayerRepository.d.ts.map