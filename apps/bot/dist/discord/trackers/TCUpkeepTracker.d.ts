import { Client } from 'discord.js';
export declare class TCUpkeepTracker {
    private client;
    private channelId;
    private messageId?;
    constructor(client: Client, channelId: string);
    start(): Promise<void>;
    private update;
}
//# sourceMappingURL=TCUpkeepTracker.d.ts.map