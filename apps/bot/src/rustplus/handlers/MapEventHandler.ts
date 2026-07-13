import { events } from '../../core/EventEmitterHub';
import { rustPlusManager } from '../../core/RustPlusManager';

export class MapEventHandler {
  private pollingIntervals: Map<string, NodeJS.Timeout> = new Map();
  private lastMarkers: Map<string, any[]> = new Map();

  constructor() {
    events.on('server:connected', (serverId) => {
      this.startPolling(serverId);
    });

    events.on('server:disconnected', (serverId) => {
      this.stopPolling(serverId);
    });
  }

  private startPolling(serverId: string) {
    if (this.pollingIntervals.has(serverId)) return;

    // Interval fixed to 30s for Rust+ optimal polling
    const interval = setInterval(() => this.poll(serverId), 30000);
    this.pollingIntervals.set(serverId, interval);
  }

  private stopPolling(serverId: string) {
    const interval = this.pollingIntervals.get(serverId);
    if (interval) {
      clearInterval(interval);
      this.pollingIntervals.delete(serverId);
    }
  }

  private async poll(serverId: string) {
    const serverInstance = rustPlusManager.getServer(serverId);
    if (!serverInstance) return;

    try {
      const markers = await serverInstance.client.getMapMarkers();
      const last = this.lastMarkers.get(serverId) || [];
      
      // Compare and find new markers
      const newMarkers = markers.filter((m: any) => !last.find(l => l.id === m.id));
      
      let monuments: any[] = [];
      try {
        const mapInfo = await serverInstance.client.client.getMap();
        if (mapInfo && mapInfo.monuments) {
          monuments = mapInfo.monuments;
        }
      } catch (e) {
        // Ignored if map fetch fails
      }
      
      for (const marker of newMarkers) {
        let type: string | null = null;
        
        // 4 = CH47, 5 = CargoShip, 6 = Crate, 8 = PatrolHelicopter
        if (marker.type === 5) type = 'cargo';
        else if (marker.type === 8) type = 'heli';
        else if (marker.type === 4) type = 'chinook';
        else if (marker.type === 6) {
          type = 'locked_crate'; // default
          
          // Check proximity to monuments to refine the crate type
          if (monuments.length > 0) {
            let closestMonument = null;
            let minDistance = Infinity;

            for (const mon of monuments) {
              const dx = mon.x - marker.x;
              const dy = mon.y - marker.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              if (dist < minDistance) {
                minDistance = dist;
                closestMonument = mon;
              }
            }

            if (closestMonument && minDistance < 150) {
              const token = closestMonument.token.toLowerCase();
              if (token.includes('oil_rig_small')) type = 'oil_rig_small';
              else if (token.includes('large_oil_rig') || token.includes('oil_rig_large')) type = 'oil_rig_large';
              else if (token.includes('underwater_lab')) type = 'deep_sea';
            }
          }
        }
        
        if (type) {
          events.emit('map:event', serverId, {
            type,
            x: marker.x,
            y: marker.y,
            timestamp: new Date()
          });
        }
      }

      this.lastMarkers.set(serverId, markers);
    } catch (error) {
      console.error(`[MapEventHandler] Error polling markers for ${serverId}:`, error);
    }
  }
}

export const mapEventHandler = new MapEventHandler();
