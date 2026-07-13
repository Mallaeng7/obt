"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fcmListener = exports.FcmListener = void 0;
const push_receiver_1 = require("push-receiver");
const EventEmitterHub_1 = require("./EventEmitterHub");
const env_1 = require("../config/env");
const client_1 = require("../database/client");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class FcmListener {
    isListening = false;
    async start(dynamicCreds) {
        if (this.isListening && !dynamicCreds)
            return;
        let credentials = dynamicCreds;
        if (!credentials) {
            if (env_1.env.FCM_CREDENTIALS) {
                try {
                    credentials = JSON.parse(env_1.env.FCM_CREDENTIALS);
                }
                catch (e) {
                    console.error('[FcmListener] Invalid FCM_CREDENTIALS format in env.');
                }
            }
            else {
                const credPath = path_1.default.join(__dirname, '../../../../fcm-credentials.json');
                if (fs_1.default.existsSync(credPath)) {
                    try {
                        credentials = JSON.parse(fs_1.default.readFileSync(credPath, 'utf8'));
                    }
                    catch (e) { }
                }
            }
        }
        if (!credentials || !credentials.gcm) {
            console.warn('[FcmListener] FCM_CREDENTIALS not provided. Push notifications disabled.');
            return;
        }
        try {
            console.log('[FcmListener] Starting FCM Push Receiver...');
            (0, push_receiver_1.listen)(credentials, this.onNotification.bind(this));
            this.isListening = true;
        }
        catch (e) {
            console.error('[FcmListener] Failed to start:', e);
        }
    }
    async onNotification({ notification }) {
        if (!notification || !notification.data)
            return;
        try {
            const body = notification.data.body ? JSON.parse(notification.data.body) : null;
            if (!body)
                return;
            const type = notification.data.channelId || body.type;
            let serverId = null;
            if (body.ip && body.port) {
                const server = await client_1.prisma.server.findFirst({
                    where: { ip: body.ip, port: parseInt(body.port, 10) }
                });
                if (server)
                    serverId = server.id;
            }
            switch (type) {
                case 'alarm':
                    if (serverId)
                        EventEmitterHub_1.events.emit('device:alarm', serverId, body);
                    break;
                case 'server':
                case 'pairing':
                    EventEmitterHub_1.events.emit('fcm:pairing', body);
                    break;
                default:
                    if (notification.data.title === 'You died' || body.type === 'death') {
                        if (serverId)
                            EventEmitterHub_1.events.emit('team:memberDeath', serverId, { steamId: body.playerId || 'Unknown', killerName: 'Unknown' });
                    }
                    else {
                        EventEmitterHub_1.events.emit('fcm:unknown', body);
                    }
                    break;
            }
        }
        catch (e) {
            console.error('[FcmListener] Failed to parse notification:', e);
        }
    }
}
exports.FcmListener = FcmListener;
exports.fcmListener = new FcmListener();
