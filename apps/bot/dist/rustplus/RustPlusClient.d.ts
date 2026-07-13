export declare class RustPlusClient {
    private rustplus;
    serverId: string;
    constructor(ip: string, port: number, steamId: string, playerToken: string, serverId: string);
    connect(): void;
    disconnect(): void;
    on(event: string, callback: (...args: any[]) => void): void;
    private sendRequestAsync;
    getServerInfo(): Promise<any>;
    getTeamInfo(): Promise<any>;
    getMapMarkers(): Promise<any>;
    getEntityInfo(entityId: number): Promise<any>;
    setEntityValue(entityId: number, value: boolean): Promise<any>;
    sendTeamMessage(message: string): Promise<any>;
    get client(): any;
    getMap(): Promise<any>;
    getTime(): Promise<any>;
    promoteToLeader(steamId: string): Promise<any>;
}
//# sourceMappingURL=RustPlusClient.d.ts.map