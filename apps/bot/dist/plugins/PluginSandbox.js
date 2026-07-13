"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.pluginSandbox = exports.PluginSandbox = void 0;
const vm = __importStar(require("vm"));
const RustPlusManager_1 = require("../core/RustPlusManager");
const EventEmitterHub_1 = require("../core/EventEmitterHub");
class PluginSandbox {
    activePlugins = new Map();
    async loadPlugin(pluginId, code) {
        try {
            // Create a secure context for the plugin
            const sandbox = {
                console: {
                    log: (...args) => console.log(`[Plugin:${pluginId}]`, ...args),
                    error: (...args) => console.error(`[Plugin:${pluginId}]`, ...args),
                },
                setTimeout,
                clearTimeout,
                setInterval,
                clearInterval,
                // Expose safe bot APIs
                rustplus: {
                    sendTeamMessage: async (serverId, message) => {
                        const server = RustPlusManager_1.rustPlusManager.getServer(serverId);
                        if (server)
                            await server.client.sendTeamMessage(message);
                    },
                    turnOnSmartSwitch: async (serverId, entityId) => {
                        const server = RustPlusManager_1.rustPlusManager.getServer(serverId);
                        if (server)
                            await server.client.setEntityValue(entityId, true);
                    },
                    turnOffSmartSwitch: async (serverId, entityId) => {
                        const server = RustPlusManager_1.rustPlusManager.getServer(serverId);
                        if (server)
                            await server.client.setEntityValue(entityId, false);
                    }
                },
                // Provide an event listener mechanism inside the sandbox
                onEvent: (eventName, callback) => {
                    EventEmitterHub_1.events.on(eventName, callback);
                }
            };
            const context = vm.createContext(sandbox);
            const script = new vm.Script(code);
            script.runInContext(context, { timeout: 1000 }); // 1 second execution timeout
            this.activePlugins.set(pluginId, context);
            console.log(`[PluginSandbox] Loaded plugin ${pluginId} successfully.`);
            return true;
        }
        catch (e) {
            console.error(`[PluginSandbox] Failed to load plugin ${pluginId}:`, e.message);
            return false;
        }
    }
    unloadPlugin(pluginId) {
        this.activePlugins.delete(pluginId);
        console.log(`[PluginSandbox] Unloaded plugin ${pluginId}.`);
    }
}
exports.PluginSandbox = PluginSandbox;
exports.pluginSandbox = new PluginSandbox();
