import { Client } from 'discord.js';
export declare class DeviceTracker {
    private client;
    private channelId;
    private messageId?;
    constructor(client: Client, channelId: string);
    start(): Promise<void>;
    private update;
}
//# sourceMappingURL=DeviceTracker.d.ts.map