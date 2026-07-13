import { Client } from 'discord.js';
export declare class TrackerManager {
    private client;
    private intervalId;
    private trackerMessages;
    init(client: Client): void;
    private startTracking;
    private updateAllTrackers;
    private updateServerTracker;
}
export declare const trackerManager: TrackerManager;
//# sourceMappingURL=TrackerManager.d.ts.map