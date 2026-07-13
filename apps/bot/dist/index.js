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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("./database/client");
const RustPlusManager_1 = require("./core/RustPlusManager");
const commands_1 = require("./rustplus/commands");
const routes_1 = require("./api/routes");
// Import handlers to instantiate them
require("./rustplus/handlers");
require("./services");
dotenv_1.default.config({ path: '../../.env' });
const start = async () => {
    try {
        // 1. Initialize DB
        await client_1.prisma.$connect();
        console.log('[App] Connected to Database');
        // 2. Register Commands
        (0, commands_1.registerCommands)();
        console.log('[App] Commands registered');
        // 3. Initialize RustPlus Connections
        await RustPlusManager_1.rustPlusManager.initialize();
        console.log('[App] RustPlus Manager initialized');
        // 4. Initialize Discord Bot
        const { discordBot } = await Promise.resolve().then(() => __importStar(require('./discord/DiscordBot')));
        await discordBot.start();
        // 5. Initialize Tracker
        const { trackerManager } = await Promise.resolve().then(() => __importStar(require('./discord/trackers/TrackerManager')));
        trackerManager.init(discordBot.client);
        // 5.1 Initialize FCM Listener
        const { fcmListener } = await Promise.resolve().then(() => __importStar(require('./core/FcmListener')));
        await fcmListener.start();
        // 6. Setup Fastify
        const fastify = (0, fastify_1.default)({ logger: true });
        fastify.register(routes_1.apiRoutes);
        const port = parseInt(process.env.BOT_API_PORT || '3001', 10);
        fastify.listen({ port, host: '0.0.0.0' }, (err, address) => {
            if (err) {
                fastify.log.error(err);
                process.exit(1);
            }
            // 5. Setup Socket.IO
            const io = new socket_io_1.Server(fastify.server, {
                cors: { origin: '*' }
            });
            const { socketManager } = require('./api/websocket/SocketManager');
            socketManager.init(io);
            console.log(`[App] Server listening at ${address}`);
        });
    }
    catch (err) {
        console.error('[App] Fatal Error:', err);
        process.exit(1);
    }
};
start();
