import { events } from './EventEmitterHub';
import { prisma } from '../database/client';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// @liamcottle/push-receiver for actual FCM registration & listening
const AndroidFCM = require('@liamcottle/push-receiver/src/android/fcm');
const PushReceiverClient = require('@liamcottle/push-receiver/src/client');

const RUSTPLUS_FCM = {
  apiKey: 'AIzaSyB5y2y-Tzqb4-I4Qnlsh_9naYv_TD8pCvY',
  projectId: 'rust-companion-app',
  gcmSenderId: '976529667804',
  gmsAppId: '1:976529667804:android:d6f1ddeb4403b338fea619',
  androidPackageName: 'com.facepunch.rust.companion',
  androidPackageCert: 'E28D05345FB78A7A1A63D70F4A302DBF426CA5AD',
  expoProjectId: '49451aca-a822-41e6-ad59-955718d0ff9c',
};

const CONFIG_PATH = path.join(__dirname, '../../../../rustplus.config.json');

interface RustPlusConfig {
  fcm_credentials?: {
    gcm: { androidId: string; securityToken: string };
    fcm: { token: string };
  };
  expo_push_token?: string;
  rustplus_auth_token?: string;
}

/**
 * Reads the rustplus config from disk (or returns empty object).
 */
function readConfig(): RustPlusConfig {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch {
    return {};
  }
}

/**
 * Merges and saves config to disk.
 */
function saveConfig(update: Partial<RustPlusConfig>) {
  const current = readConfig();
  const merged = { ...current, ...update };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(merged, null, 2), 'utf8');
}

/**
 * Step 1: Register with FCM to get GCM androidId/securityToken + FCM token.
 */
async function registerFcm() {
  console.log('[FcmListener] Registering with FCM (AndroidFCM.register)...');
  const creds = await AndroidFCM.register(
    RUSTPLUS_FCM.apiKey,
    RUSTPLUS_FCM.projectId,
    RUSTPLUS_FCM.gcmSenderId,
    RUSTPLUS_FCM.gmsAppId,
    RUSTPLUS_FCM.androidPackageName,
    RUSTPLUS_FCM.androidPackageCert
  );
  console.log('[FcmListener] FCM registration successful.');
  return creds;
}

/**
 * Step 2: Convert the FCM token into an Expo Push Token.
 */
async function getExpoPushToken(fcmToken: string): Promise<string> {
  console.log('[FcmListener] Fetching Expo Push Token...');
  const res = await axios.post('https://exp.host/--/api/v2/push/getExpoPushToken', {
    type: 'fcm',
    deviceId: uuidv4(),
    development: false,
    appId: RUSTPLUS_FCM.androidPackageName,
    deviceToken: fcmToken,
    projectId: RUSTPLUS_FCM.expoProjectId,
  });
  const token = res.data.data.expoPushToken;
  console.log('[FcmListener] Expo Push Token obtained:', token);
  return token;
}

/**
 * Step 3: Register the Expo Push Token with Facepunch's Companion API.
 * Requires a Rust+ auth token (obtained via Steam login).
 */
async function registerWithRustPlus(authToken: string, expoPushToken: string) {
  console.log('[FcmListener] Registering with Rust Companion API...');
  await axios.post('https://companion-rust.facepunch.com:443/api/push/register', {
    AuthToken: authToken,
    DeviceId: 'rustplus.js',
    PushKind: 3,
    PushToken: expoPushToken,
  });
  console.log('[FcmListener] Successfully registered with Rust Companion API.');
}

export class FcmListener {
  private client: any = null;
  private isListening = false;

  /**
   * Full auto-setup: register FCM → get Expo token → register with Facepunch.
   * Requires a Steam auth token (passed or from config).
   */
  public async setup(steamAuthToken?: string) {
    try {
      let config = readConfig();

      // If we already have FCM credentials, skip registration
      if (!config.fcm_credentials) {
        const creds = await registerFcm();
        config.fcm_credentials = creds;
        saveConfig({ fcm_credentials: creds });
      }

      // Get Expo push token if not cached
      if (!config.expo_push_token && config.fcm_credentials?.fcm?.token) {
        const expoToken = await getExpoPushToken(config.fcm_credentials.fcm.token);
        config.expo_push_token = expoToken;
        saveConfig({ expo_push_token: expoToken });
      }

      // Use provided auth token or fall back to stored one
      const authToken = steamAuthToken || config.rustplus_auth_token;
      if (authToken && config.expo_push_token) {
        config.rustplus_auth_token = authToken;
        saveConfig({ rustplus_auth_token: authToken });
        await registerWithRustPlus(authToken, config.expo_push_token);
      } else {
        console.warn(
          '[FcmListener] No Steam auth token available. FCM is registered but NOT linked to Rust+.\n' +
          '[FcmListener] Use the /credentials add command in Discord to provide your Steam auth token.'
        );
      }

      // Start listening
      await this.startListening(config);
    } catch (err) {
      console.error('[FcmListener] Setup failed:', err);
    }
  }

  /**
   * Start listening for FCM push notifications using stored credentials.
   */
  public async start() {
    const config = readConfig();

    if (config.fcm_credentials) {
      // Already have credentials, just start listening (and re-register if auth token exists)
      await this.setup();
    } else {
      // No credentials at all, do full registration
      await this.setup();
    }
  }

  /**
   * Restart the listener with a new Steam auth token (called from /credentials add).
   */
  public async restartWithAuthToken(authToken: string) {
    // Stop existing listener
    if (this.client) {
      try { this.client.destroy(); } catch { /* ignore */ }
      this.client = null;
      this.isListening = false;
    }

    await this.setup(authToken);
  }

  /**
   * Connect to FCM and listen for notifications.
   */
  private async startListening(config: RustPlusConfig) {
    if (this.isListening) return;
    if (!config.fcm_credentials) {
      console.warn('[FcmListener] Cannot listen: no FCM credentials.');
      return;
    }

    try {
      const { androidId, securityToken } = config.fcm_credentials.gcm;
      console.log('[FcmListener] Connecting to FCM Push Receiver...');

      this.client = new PushReceiverClient(androidId, securityToken, []);
      this.client.on('ON_DATA_RECEIVED', this.onNotification.bind(this));

      await this.client.connect();
      this.isListening = true;
      console.log('[FcmListener] ✅ Now listening for Rust+ push notifications.');
    } catch (err) {
      console.error('[FcmListener] Failed to connect:', err);
    }
  }

  /**
   * Handle an incoming FCM notification.
   */
  private async onNotification(data: any) {
    try {
      // @liamcottle/push-receiver sends raw protobuf data
      // The notification data is in different formats depending on the push-receiver version
      const notification = data?.notification || data;
      if (!notification) return;

      // Try to extract the body from different formats
      let body: any = null;
      let channelId: string | null = null;
      let title: string | null = null;

      if (notification.data) {
        // Standard FCM format
        if (notification.data.body) {
          try { body = JSON.parse(notification.data.body); } catch { body = notification.data.body; }
        }
        channelId = notification.data.channelId || null;
        title = notification.data.title || null;
      } else if (notification.appData) {
        // @liamcottle/push-receiver format: appData is an array of {key, value}
        for (const item of notification.appData) {
          if (item.key === 'body') {
            try { body = JSON.parse(item.value); } catch { body = item.value; }
          }
          if (item.key === 'channelId') channelId = item.value;
          if (item.key === 'title') title = item.value;
        }
      }

      if (!body) {
        console.log('[FcmListener] Received notification without body:', JSON.stringify(data).slice(0, 200));
        return;
      }

      console.log('[FcmListener] Notification received:', { channelId, title, type: body.type, ip: body.ip, port: body.port });

      const type = channelId || body.type;

      // Look up server by IP
      let serverId: string | null = null;
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
          if (title === 'You died' || body.type === 'death') {
            if (serverId) events.emit('team:memberDeath', serverId, { steamId: body.playerId || 'Unknown', killerName: 'Unknown' });
          } else {
            // Could be a pairing notification in different format
            if (body.ip && body.port && body.playerToken) {
              events.emit('fcm:pairing', body);
            } else {
              console.log('[FcmListener] Unknown notification type:', type, body);
            }
          }
          break;
      }
    } catch (err) {
      console.error('[FcmListener] Failed to process notification:', err);
    }
  }
}

export const fcmListener = new FcmListener();
