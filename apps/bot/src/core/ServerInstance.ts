import { RustPlusClient } from '../rustplus/RustPlusClient';
import { events } from './EventEmitterHub';

export class ServerInstance {
  public id: string;
  public client: RustPlusClient;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private isIntentionalDisconnect = false;
  private retryCount = 0;

  constructor(id: string, ip: string, port: number, steamId: string, playerToken: string) {
    this.id = id;
    this.client = new RustPlusClient(ip, port, steamId, playerToken, id);

    this.client.on('connected', () => {
      this.retryCount = 0;
      events.emit('server:connected', this.id);
    });

    this.client.on('disconnected', () => {
      if (!this.isIntentionalDisconnect) {
        events.emit('server:disconnected', this.id, 'Connection lost');
        this.scheduleReconnect();
      } else {
        events.emit('server:disconnected', this.id, 'Intentional disconnect');
      }
    });

    this.client.on('error', (err: any) => {
      console.error(`[ServerInstance ${this.id}] Error:`, err);
    });

    // Handle rustplus.js internal events if exposed, or hook directly
    // This assumes rustplus client exposes raw messages or has a camera event
    this.client.client.on('message', (message: any) => {
      if (message && message.response && message.response.cameraSubscribeInfo) {
        // Handle subscription info if needed
      }
      // Usually rustplus.js sends raw bytes for raycasts in message.response.cameraRayData
      // or similar depending on the wrapper.
      if (message && message.response && message.response.cameraRayData) {
        // Pass the raw data buffer
        events.emit('camera:frame', this.id, message.response.cameraRayData.videoBuffer);
      }
    });
  }

  public connect() {
    this.isIntentionalDisconnect = false;
    this.client.connect();
  }

  public disconnect() {
    this.isIntentionalDisconnect = true;
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.client.disconnect();
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) return;
    
    // Exponential backoff: 5s, 10s, 30s, 60s max
    const backoff = [5000, 10000, 30000, 60000];
    const delay = backoff[Math.min(this.retryCount, backoff.length - 1)];
    
    events.emit('server:reconnecting', this.id);
    this.retryCount++;
    
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
    }, delay);
  }
}
