import { EventEmitter } from 'events';
import { VendingItem } from '@prisma/client';
import { DeviceStatus, MapEvent, TeamMember } from '@obt/shared-types';
export interface BotEvents {
    'server:connected': (serverId: string) => void;
    'server:disconnected': (serverId: string, reason: string) => void;
    'server:reconnecting': (serverId: string) => void;
    'team:chat': (serverId: string, message: {
        steamId: string;
        name: string;
        message: string;
        color: string;
        time: number;
    }) => void;
    'team:memberUpdate': (serverId: string, member: TeamMember) => void;
    'team:memberDeath': (serverId: string, death: {
        steamId: string;
        killerName?: string;
        weapon?: string;
        distance?: number;
        x?: number;
        y?: number;
    }) => void;
    'map:event': (serverId: string, event: MapEvent) => void;
    'device:alarm': (serverId: string, alarm: {
        entityId: number;
        name: string;
        title: string;
        message: string;
    }) => void;
    'device:statusChange': (serverId: string, device: DeviceStatus) => void;
    'vending:newItem': (serverId: string, item: VendingItem) => void;
    'camera:frame': (serverId: string, buffer: any) => void;
    'fcm:pairing': (payload: any) => void;
    'fcm:unknown': (payload: any) => void;
}
export declare interface EventEmitterHub {
    on<U extends keyof BotEvents>(event: U, listener: BotEvents[U]): this;
    emit<U extends keyof BotEvents>(event: U, ...args: Parameters<BotEvents[U]>): boolean;
}
export declare class EventEmitterHub extends EventEmitter {
    constructor();
}
export declare const events: EventEmitterHub;
//# sourceMappingURL=EventEmitterHub.d.ts.map