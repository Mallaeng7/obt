export declare class VendingService {
    addWatchItem(serverId: string, steamId: string, itemName: string): Promise<{
        id: string;
        itemName: string;
        serverId: string;
        isActive: boolean;
        createdAt: Date;
        requestedBy: string;
    }>;
    getWatchItems(serverId: string): Promise<{
        id: string;
        itemName: string;
        serverId: string;
        isActive: boolean;
        createdAt: Date;
        requestedBy: string;
    }[]>;
    updateVendingItems(serverId: string, items: any[]): Promise<void>;
}
export declare const vendingService: VendingService;
//# sourceMappingURL=VendingService.d.ts.map