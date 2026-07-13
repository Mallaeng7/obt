import Fastify from 'fastify';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { prisma } from './database/client';
import { rustPlusManager } from './core/RustPlusManager';
import { registerCommands } from './rustplus/commands';
import { apiRoutes } from './api/routes';

// Import handlers to instantiate them
import './rustplus/handlers';
import './services';

dotenv.config({ path: '../../.env' });

const start = async () => {
  try {
    // 1. Initialize DB
    await prisma.$connect();
    console.log('[App] Connected to Database');

    // 2. Register Commands
    registerCommands();
    console.log('[App] Commands registered');

    // 3. Initialize RustPlus Connections
    await rustPlusManager.initialize();
    console.log('[App] RustPlus Manager initialized');

    // 4. Initialize Discord Bot
    const { discordBot } = await import('./discord/DiscordBot');
    await discordBot.start();
    
    // 5. Initialize Tracker
    const { trackerManager } = await import('./discord/trackers/TrackerManager');
    trackerManager.init(discordBot.client);

    // 5.1 Initialize FCM Listener
    const { fcmListener } = await import('./core/FcmListener');
    await fcmListener.start();

    // 6. Setup Fastify
    const fastify = Fastify({ logger: true });
    fastify.register(apiRoutes);

    const port = parseInt(process.env.BOT_API_PORT || '3001', 10);
    
    fastify.listen({ port, host: '0.0.0.0' }, (err, address) => {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }
      
      // 5. Setup Socket.IO
      const io = new Server(fastify.server, {
        cors: { origin: '*' }
      });
      
      const { socketManager } = require('./api/websocket/SocketManager');
      socketManager.init(io);

      console.log(`[App] Server listening at ${address}`);
    });

  } catch (err) {
    console.error('[App] Fatal Error:', err);
    process.exit(1);
  }
};

start();
