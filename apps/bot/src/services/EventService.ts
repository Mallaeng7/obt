import { events } from '../core/EventEmitterHub';
import { prisma } from '../database/client';

export class EventService {
  constructor() {
    events.on('map:event', async (serverId, event) => {
      try {
        await prisma.serverEvent.create({
          data: {
            type: event.type,
            x: event.x,
            y: event.y,
            serverId
          }
        });
      } catch (e) {
        console.error('[EventService] Failed to save event:', e);
      }
    });
  }
}

export const eventService = new EventService();
