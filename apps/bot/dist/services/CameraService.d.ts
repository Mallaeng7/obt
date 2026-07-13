export declare class CameraService {
    registerCamera(serverId: string, identifier: string, name: string, type: string): Promise<{
        name: string | null;
        id: string;
        serverId: string;
        type: string;
        identifier: string;
    }>;
    getCameras(serverId: string): Promise<{
        name: string | null;
        id: string;
        serverId: string;
        type: string;
        identifier: string;
    }[]>;
    deleteCamera(serverId: string, identifier: string): Promise<{
        name: string | null;
        id: string;
        serverId: string;
        type: string;
        identifier: string;
    }>;
}
export declare const cameraService: CameraService;
//# sourceMappingURL=CameraService.d.ts.map