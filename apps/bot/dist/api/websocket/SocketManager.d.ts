import { Server } from 'socket.io';
export declare class SocketManager {
    private io;
    init(io: Server): void;
    getIO(): Server<import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, import("socket.io").DefaultEventsMap, any> | null;
}
export declare const socketManager: SocketManager;
//# sourceMappingURL=SocketManager.d.ts.map