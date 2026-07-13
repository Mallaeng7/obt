"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventService = exports.EventService = void 0;
const EventEmitterHub_1 = require("../core/EventEmitterHub");
const client_1 = require("../database/client");
class EventService {
    constructor() {
        EventEmitterHub_1.events.on('map:event', async (serverId, event) => {
            try {
                await client_1.prisma.serverEvent.create({
                    data: {
                        type: event.type,
                        x: event.x,
                        y: event.y,
                        serverId
                    }
                });
            }
            catch (e) {
                console.error('[EventService] Failed to save event:', e);
            }
        });
    }
}
exports.EventService = EventService;
exports.eventService = new EventService();
