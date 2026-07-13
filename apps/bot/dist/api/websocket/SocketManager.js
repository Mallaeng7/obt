"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketManager = exports.SocketManager = void 0;
const EventEmitterHub_1 = require("../../core/EventEmitterHub");
class SocketManager {
    io = null;
    init(io) {
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
                    }
                    else if (action === 'unsubscribe') {
                        server.client.client.unsubscribeFromCamera();
                    }
                }
            });
            socket.on('disconnect', () => {
                console.log('[Socket] Client disconnected:', socket.id);
            });
        });
        // Wire EventEmitterHub to Socket.IO for S->C broadcasts
        EventEmitterHub_1.events.on('server:connected', (serverId) => {
            io.emit('server:status', { serverId, status: 'connected' });
        });
        EventEmitterHub_1.events.on('server:disconnected', (serverId, reason) => {
            io.emit('server:status', { serverId, status: 'disconnected', reason });
        });
        EventEmitterHub_1.events.on('map:event', (serverId, event) => {
            io.emit('event:new', { serverId, ...event });
        });
        EventEmitterHub_1.events.on('device:statusChange', (serverId, device) => {
            io.emit('device:status', { serverId, ...device });
        });
        EventEmitterHub_1.events.on('device:alarm', (serverId, alarm) => {
            io.emit('alert:push', { serverId, type: 'alarm', ...alarm });
        });
        EventEmitterHub_1.events.on('team:memberDeath', (serverId, death) => {
            io.emit('alert:push', { serverId, type: 'death', ...death });
        });
        EventEmitterHub_1.events.on('team:memberUpdate', (serverId, member) => {
            io.emit('team:update', { serverId, ...member });
        });
        EventEmitterHub_1.events.on('camera:frame', (serverId, buffer) => {
            io.emit('camera:frame', { serverId, buffer: buffer.toString('base64') });
        });
    }
    getIO() {
        return this.io;
    }
}
exports.SocketManager = SocketManager;
exports.socketManager = new SocketManager();
