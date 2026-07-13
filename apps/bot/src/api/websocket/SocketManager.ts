import { Server } from 'socket.io';
import { events } from '../../core/EventEmitterHub';

export class SocketManager {
  private io: Server | null = null;

  public init(io: Server) {
    this.io = io;

    io.on('connection', (socket) => {
      console.log('[Socket] Client connected:', socket.id);

      // Handle camera control events from client to server
      socket.on('camera:control', async (data) => {
        const { serverId, identifier, action } = data;
        const { rustplusManager } = require('../../core/RustPlusManager');
        const server = rustplusManager.getServer(serverId);
        if (server) {
          if (action === 'subscribe') {
            server.client.client.subscribeToCamera(identifier);
          } else if (action === 'unsubscribe') {
            server.client.client.unsubscribeFromCamera();
          }
        }
      });

      socket.on('disconnect', () => {
        console.log('[Socket] Client disconnected:', socket.id);
      });
    });

    // Wire EventEmitterHub to Socket.IO for S->C broadcasts
    events.on('server:connected', (serverId) => {
      io.emit('server:status', { serverId, status: 'connected' });
    });

    events.on('server:disconnected', (serverId, reason) => {
      io.emit('server:status', { serverId, status: 'disconnected', reason });
    });

    events.on('map:event', (serverId, event) => {
      io.emit('event:new', { serverId, ...event });
    });

    events.on('device:statusChange', (serverId, device) => {
      io.emit('device:status', { serverId, ...device });
    });

    events.on('device:alarm', (serverId, alarm) => {
      io.emit('alert:push', { serverId, type: 'alarm', ...alarm });
    });

    events.on('team:memberDeath', (serverId, death) => {
      io.emit('alert:push', { serverId, type: 'death', ...death });
    });

    events.on('team:memberUpdate', (serverId, member) => {
      io.emit('team:update', { serverId, ...member });
    });

    events.on('camera:frame', (serverId, buffer) => {
      io.emit('camera:frame', { serverId, buffer: buffer.toString('base64') });
    });
  }
  
  public getIO() {
    return this.io;
  }
}

export const socketManager = new SocketManager();
