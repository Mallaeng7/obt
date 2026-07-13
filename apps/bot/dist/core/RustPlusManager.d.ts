import { ServerInstance } from './ServerInstance';
export declare class RustPlusManager {
    private instances;
    initialize(): Promise<void>;
    addServer(id: string, ip: string, port: number, steamId: string, playerToken: string): Promise<void>;
    removeServer(id: string): void;
    getServer(id: string): ServerInstance | undefined;
    getAllServers(): ServerInstance[];
}
export declare const rustPlusManager: RustPlusManager;
//# sourceMappingURL=RustPlusManager.d.ts.map