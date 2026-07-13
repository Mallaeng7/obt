"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapEventHandler = exports.MapEventHandler = void 0;
const EventEmitterHub_1 = require("../../core/EventEmitterHub");
const RustPlusManager_1 = require("../../core/RustPlusManager");
class MapEventHandler {
    pollingIntervals = new Map();
    lastMarkers = new Map();
    constructor() {
        EventEmitterHub_1.events.on('server:connected', (serverId) => {
            this.startPolling(serverId);
        });
        EventEmitterHub_1.events.on('server:disconnected', (serverId) => {
            this.stopPolling(serverId);
        });
    }
    startPolling(serverId) {
        if (this.pollingIntervals.has(serverId))
            return;
        // Interval fixed to 30s for Rust+ optimal polling
        const interval = setInterval(() => this.poll(serverId), 30000);
        this.pollingIntervals.set(serverId, interval);
    }
    stopPolling(serverId) {
        const interval = this.pollingIntervals.get(serverId);
        if (interval) {
            clearInterval(interval);
            this.pollingIntervals.delete(serverId);
        }
    }
    async poll(serverId) {
        const serverInstance = RustPlusManager_1.rustPlusManager.getServer(serverId);
        if (!serverInstance)
            return;
        try {
            const markers = await serverInstance.client.getMapMarkers();
            const last = this.lastMarkers.get(serverId) || [];
            // Compare and find new markers
            const newMarkers = markers.filter((m) => !last.find(l => l.id === m.id));
            let monuments = [];
            try {
                const mapInfo = await serverInstance.client.client.getMap();
                if (mapInfo && mapInfo.monuments) {
                    monuments = mapInfo.monuments;
                }
            }
            catch (e) {
                // Ignored if map fetch fails
            }
            for (const marker of newMarkers) {
                let type = null;
                // 4 = CH47, 5 = CargoShip, 6 = Crate, 8 = PatrolHelicopter
                if (marker.type === 5)
                    type = 'cargo';
                else if (marker.type === 8)
                    type = 'heli';
                else if (marker.type === 4)
                    type = 'chinook';
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
                            if (token.includes('oil_rig_small'))
                                type = 'oil_rig_small';
                            else if (token.includes('large_oil_rig') || token.includes('oil_rig_large'))
                                type = 'oil_rig_large';
                            else if (token.includes('underwater_lab'))
                                type = 'deep_sea';
                        }
                    }
                }
                if (type) {
                    EventEmitterHub_1.events.emit('map:event', serverId, {
                        type,
                        x: marker.x,
                        y: marker.y,
                        timestamp: new Date()
                    });
                }
            }
            this.lastMarkers.set(serverId, markers);
        }
        catch (error) {
            console.error(`[MapEventHandler] Error polling markers for ${serverId}:`, error);
        }
    }
}
exports.MapEventHandler = MapEventHandler;
exports.mapEventHandler = new MapEventHandler();
