export declare class ServerRepository {
    findAllActive(): Promise<{
        name: string;
        id: string;
        ip: string;
        port: number;
        appPort: number;
        steamId: string;
        playerToken: string;
        seed: number | null;
        mapSize: number | null;
        mapImageUrl: string | null;
        wipeDate: Date | null;
        discordGuildId: string | null;
        alertChannelId: string | null;
        trackerChannelId: string | null;
        isActive: boolean;
        pollingInterval: number;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(data: any): Promise<{
        name: string;
        id: string;
        ip: string;
        port: number;
        appPort: number;
        steamId: string;
        playerToken: string;
        seed: number | null;
        mapSize: number | null;
        mapImageUrl: string | null;
        wipeDate: Date | null;
        discordGuildId: string | null;
        alertChannelId: string | null;
        trackerChannelId: string | null;
        isActive: boolean;
        pollingInterval: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<{
        name: string;
        id: string;
        ip: string;
        port: number;
        appPort: number;
        steamId: string;
        playerToken: string;
        seed: number | null;
        mapSize: number | null;
        mapImageUrl: string | null;
        wipeDate: Date | null;
        discordGuildId: string | null;
        alertChannelId: string | null;
        trackerChannelId: string | null;
        isActive: boolean;
        pollingInterval: number;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export declare const serverRepository: ServerRepository;
//# sourceMappingURL=ServerRepository.d.ts.map