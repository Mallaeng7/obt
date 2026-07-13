export declare class PluginSandbox {
    private activePlugins;
    loadPlugin(pluginId: string, code: string): Promise<boolean>;
    unloadPlugin(pluginId: string): void;
}
export declare const pluginSandbox: PluginSandbox;
//# sourceMappingURL=PluginSandbox.d.ts.map