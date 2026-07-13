import * as vm from 'vm';
import { rustPlusManager } from '../core/RustPlusManager';
import { prisma } from '../database/client';
import { events } from '../core/EventEmitterHub';

export class PluginSandbox {
  private activePlugins: Map<string, vm.Context> = new Map();

  public async loadPlugin(pluginId: string, code: string) {
    try {
      // Create a secure context for the plugin
      const sandbox = {
        console: {
          log: (...args: any[]) => console.log(`[Plugin:${pluginId}]`, ...args),
          error: (...args: any[]) => console.error(`[Plugin:${pluginId}]`, ...args),
        },
        setTimeout,
        clearTimeout,
        setInterval,
        clearInterval,
        // Expose safe bot APIs
        rustplus: {
          sendTeamMessage: async (serverId: string, message: string) => {
            const server = rustPlusManager.getServer(serverId);
            if (server) await server.client.sendTeamMessage(message);
          },
          turnOnSmartSwitch: async (serverId: string, entityId: number) => {
            const server = rustPlusManager.getServer(serverId);
            if (server) await server.client.setEntityValue(entityId, true);
          },
          turnOffSmartSwitch: async (serverId: string, entityId: number) => {
            const server = rustPlusManager.getServer(serverId);
            if (server) await server.client.setEntityValue(entityId, false);
          }
        },
        // Provide an event listener mechanism inside the sandbox
        onEvent: (eventName: string, callback: (...args: any[]) => void) => {
          events.on(eventName as any, callback);
        }
      };

      const context = vm.createContext(sandbox);
      const script = new vm.Script(code);
      
      script.runInContext(context, { timeout: 1000 }); // 1 second execution timeout
      this.activePlugins.set(pluginId, context);
      console.log(`[PluginSandbox] Loaded plugin ${pluginId} successfully.`);
      return true;
    } catch (e: any) {
      console.error(`[PluginSandbox] Failed to load plugin ${pluginId}:`, e.message);
      return false;
    }
  }

  public unloadPlugin(pluginId: string) {
    this.activePlugins.delete(pluginId);
    console.log(`[PluginSandbox] Unloaded plugin ${pluginId}.`);
  }
}

export const pluginSandbox = new PluginSandbox();
