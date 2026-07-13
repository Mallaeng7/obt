import { Client } from 'discord.js';
export declare class ServerInfoTracker {
    private client;
    private channelId;
    private messageId?;
    constructor(client: Client, channelId: string);
    start(): Promise<void>;
    private update;
}
//# sourceMappingURL=ServerInfoTracker.d.ts.map