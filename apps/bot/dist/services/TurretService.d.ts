export declare class TurretService {
    addTurret(serverId: string, x: number, y: number, floor: number, label?: string): Promise<{
        id: string;
        x: number;
        y: number;
        serverId: string;
        label: string | null;
        floor: number;
    }>;
    checkInterference(serverId: string, x: number, y: number): Promise<number>;
}
export declare const turretService: TurretService;
//# sourceMappingURL=TurretService.d.ts.map