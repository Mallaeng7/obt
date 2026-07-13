import { RustPlusClient } from '../rustplus/RustPlusClient';
export declare class ServerInstance {
    id: string;
    client: RustPlusClient;
    private reconnectTimeout;
    private isIntentionalDisconnect;
    private retryCount;
    constructor(id: string, ip: string, port: number, steamId: string, playerToken: string);
    connect(): void;
    disconnect(): void;
    private scheduleReconnect;
}
//# sourceMappingURL=ServerInstance.d.ts.map