import { Client } from 'discord.js';
export declare class EventTracker {
    private client;
    private channelId;
    private messageId?;
    constructor(client: Client, channelId: string);
    start(): Promise<void>;
    private update;
}
//# sourceMappingURL=EventTracker.d.ts.map