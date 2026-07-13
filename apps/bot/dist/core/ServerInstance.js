"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerInstance = void 0;
const RustPlusClient_1 = require("../rustplus/RustPlusClient");
const EventEmitterHub_1 = require("./EventEmitterHub");
class ServerInstance {
    id;
    client;
    reconnectTimeout = null;
    isIntentionalDisconnect = false;
    retryCount = 0;
    constructor(id, ip, port, steamId, playerToken) {
        this.id = id;
        this.client = new RustPlusClient_1.RustPlusClient(ip, port, steamId, playerToken, id);
        this.client.on('connected', () => {
            this.retryCount = 0;
            EventEmitterHub_1.events.emit('server:connected', this.id);
        });
        this.client.on('disconnected', () => {
            if (!this.isIntentionalDisconnect) {
                EventEmitterHub_1.events.emit('server:disconnected', this.id, 'Connection lost');
                this.scheduleReconnect();
            }
            else {
                EventEmitterHub_1.events.emit('server:disconnected', this.id, 'Intentional disconnect');
            }
        });
        this.client.on('error', (err) => {
            console.error(`[ServerInstance ${this.id}] Error:`, err);
        });
        // Handle rustplus.js internal events if exposed, or hook directly
        // This assumes rustplus client exposes raw messages or has a camera event
        this.client.client.on('message', (message) => {
            if (message && message.response && message.response.cameraSubscribeInfo) {
                // Handle subscription info if needed
            }
            // Usually rustplus.js sends raw bytes for raycasts in message.response.cameraRayData
            // or similar depending on the wrapper.
            if (message && message.response && message.response.cameraRayData) {
                // Pass the raw data buffer
                EventEmitterHub_1.events.emit('camera:frame', this.id, message.response.cameraRayData.videoBuffer);
            }
        });
    }
    connect() {
        this.isIntentionalDisconnect = false;
        this.client.connect();
    }
    disconnect() {
        this.isIntentionalDisconnect = true;
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = null;
        }
        this.client.disconnect();
    }
    scheduleReconnect() {
        if (this.reconnectTimeout)
            return;
        // Exponential backoff: 5s, 10s, 30s, 60s max
        const backoff = [5000, 10000, 30000, 60000];
        const delay = backoff[Math.min(this.retryCount, backoff.length - 1)];
        EventEmitterHub_1.events.emit('server:reconnecting', this.id);
        this.retryCount++;
        this.reconnectTimeout = setTimeout(() => {
            this.reconnectTimeout = null;
            this.connect();
        }, delay);
    }
}
exports.ServerInstance = ServerInstance;
