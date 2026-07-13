import { listen } from 'push-receiver';
import { events } from './EventEmitterHub';
import { env } from '../config/env';
import { prisma } from '../database/client';

import fs from 'fs';
import path from 'path';

export class FcmListener {
  private isListening = false;

  public async start(dynamicCreds?: any) {
    if (this.isListening && !dynamicCreds) return;

    let credentials = dynamicCreds;

    if (!credentials) {
      if (env.FCM_CREDENTIALS) {
        try {
          credentials = JSON.parse(env.FCM_CREDENTIALS);
        } catch (e) {
          console.error('[FcmListener] Invalid FCM_CREDENTIALS format in env.');
        }
      } else {
        const credPath = path.join(__dirname, '../../../../fcm-credentials.json');
        if (fs.existsSync(credPath)) {
          try {
            credentials = JSON.parse(fs.readFileSync(credPath, 'utf8'));
          } catch (e) {}
        }
      }
    }

    if (!credentials || !credentials.gcm) {
      console.warn('[FcmListener] FCM_CREDENTIALS not provided. Push notifications disabled.');
      return;
    }

    try {
      console.log('[FcmListener] Starting FCM Push Receiver...');
      listen(credentials, this.onNotification.bind(this));
      this.isListening = true;
    } catch (e) {
      console.error('[FcmListener] Failed to start:', e);
    }
  }

  private async onNotification({ notification }: any) {
    if (!notification || !notification.data) return;
    
    try {
      const body = notification.data.body ? JSON.parse(notification.data.body) : null;
      if (!body) return;

      const type = notification.data.channelId || body.type;

      let serverId = null;
      if (body.ip && body.port) {
        const server = await prisma.server.findFirst({
          where: { ip: body.ip, port: parseInt(body.port, 10) }
        });
        if (server) serverId = server.id;
      }

      switch (type) {
        case 'alarm':
          if (serverId) events.emit('device:alarm', serverId, body);
          break;
        case 'server':
        case 'pairing':
          events.emit('fcm:pairing', body);
          break;
        default:
          if (notification.data.title === 'You died' || body.type === 'death') {
             if (serverId) events.emit('team:memberDeath', serverId, { steamId: body.playerId || 'Unknown', killerName: 'Unknown' });
          } else {
             events.emit('fcm:unknown', body);
          }
          break;
      }
    } catch (e) {
      console.error('[FcmListener] Failed to parse notification:', e);
    }
  }
}

export const fcmListener = new FcmListener();
