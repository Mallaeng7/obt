export interface PluginContext {
  serverId: string;
  rustplus: {
    sendTeamMessage: (message: string) => Promise<void>;
    turnOnSmartSwitch: (entityId: number) => Promise<void>;
    turnOffSmartSwitch: (entityId: number) => Promise<void>;
  };
  onEvent: (eventName: string, callback: (...args: any[]) => void) => void;
  storage: {
    get: (key: string) => any;
    set: (key: string, value: any) => void;
  };
}

export interface PluginDefinition {
  id: string;
  name: string;
  description: string;
  onLoad: (ctx: PluginContext) => void;
  onUnload: () => void;
}
