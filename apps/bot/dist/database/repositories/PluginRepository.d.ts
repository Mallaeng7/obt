export declare class PluginRepository {
    findByServer(serverId: string): Promise<{
        name: string;
        id: string;
        serverId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        code: string;
        trigger: string | null;
        isBuiltin: boolean;
        version: string;
    }[]>;
    create(data: any): Promise<{
        name: string;
        id: string;
        serverId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        code: string;
        trigger: string | null;
        isBuiltin: boolean;
        version: string;
    }>;
    delete(id: string): Promise<{
        name: string;
        id: string;
        serverId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        code: string;
        trigger: string | null;
        isBuiltin: boolean;
        version: string;
    }>;
}
export declare const pluginRepository: PluginRepository;
//# sourceMappingURL=PluginRepository.d.ts.map