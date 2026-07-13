export declare class EventRepository {
    create(serverId: string, type: string, x: number, y: number): Promise<{
        id: string;
        x: number | null;
        y: number | null;
        serverId: string;
        createdAt: Date;
        type: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    findRecent(serverId: string, limit?: number): Promise<{
        id: string;
        x: number | null;
        y: number | null;
        serverId: string;
        createdAt: Date;
        type: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
}
export declare const eventRepository: EventRepository;
//# sourceMappingURL=EventRepository.d.ts.map