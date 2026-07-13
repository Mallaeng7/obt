import { Client } from 'discord.js';
export declare class TeamTracker {
    private client;
    private channelId;
    private messageId?;
    constructor(client: Client, channelId: string);
    start(): Promise<void>;
    private update;
}
//# sourceMappingURL=TeamTracker.d.ts.map