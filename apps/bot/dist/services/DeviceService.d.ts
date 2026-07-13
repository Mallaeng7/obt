export declare class DeviceService {
    registerDevice(serverId: string, entityId: number, name: string, type: string): Promise<{
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
    getDevices(serverId: string): Promise<{
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
    deleteDevice(serverId: string, entityId: number): Promise<{
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
export declare const deviceService: DeviceService;
//# sourceMappingURL=DeviceService.d.ts.map