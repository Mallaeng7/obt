export declare class DeviceRepository {
    findByServer(serverId: string): Promise<{
        name: string;
        id: string;
        serverId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        entityId: number;
        groupName: string | null;
        lastToggled: Date | null;
    }[]>;
    upsert(serverId: string, entityId: number, name: string, type: string): Promise<{
        name: string;
        id: string;
        serverId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        entityId: number;
        groupName: string | null;
        lastToggled: Date | null;
    }>;
}
export declare const deviceRepository: DeviceRepository;
//# sourceMappingURL=DeviceRepository.d.ts.map