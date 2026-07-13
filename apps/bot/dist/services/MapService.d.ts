export declare class MapService {
    saveNote(serverId: string, x: number, y: number, label: string, color: string): Promise<{
        id: string;
        x: number;
        y: number;
        serverId: string;
        createdAt: Date;
        label: string;
        icon: number;
        color: string;
        createdBy: string | null;
    }>;
    getNotes(serverId: string): Promise<{
        id: string;
        x: number;
        y: number;
        serverId: string;
        createdAt: Date;
        label: string;
        icon: number;
        color: string;
        createdBy: string | null;
    }[]>;
    deleteNote(noteId: string): Promise<{
        id: string;
        x: number;
        y: number;
        serverId: string;
        createdAt: Date;
        label: string;
        icon: number;
        color: string;
        createdBy: string | null;
    }>;
}
export declare const mapService: MapService;
//# sourceMappingURL=MapService.d.ts.map