"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = exports.NotificationService = void 0;
const EventEmitterHub_1 = require("../core/EventEmitterHub");
const RustPlusManager_1 = require("../core/RustPlusManager");
const client_1 = require("../database/client");
const DiscordBot_1 = require("../discord/DiscordBot");
const discord_js_1 = require("discord.js");
const VoiceClient_1 = require("../discord/VoiceClient");
class NotificationService {
    constructor() {
        EventEmitterHub_1.events.on('map:event', async (serverId, event) => {
            const server = RustPlusManager_1.rustPlusManager.getServer(serverId);
            if (!server)
                return;
            const msg = this.formatEventMessage(event.type);
            if (msg) {
                await server.client.sendTeamMessage(msg);
                await this.sendDiscordAlert(serverId, `🗺️ Map Event`, msg);
            }
        });
        EventEmitterHub_1.events.on('device:alarm', async (serverId, alarm) => {
            const server = RustPlusManager_1.rustPlusManager.getServer(serverId);
            if (!server)
                return;
            const msg = `🚨 ALARM [${alarm.name}]: ${alarm.title} - ${alarm.message}`;
            await server.client.sendTeamMessage(msg);
            await this.sendDiscordAlert(serverId, `🚨 Smart Alarm: ${alarm.name}`, alarm.message, 0xFF0000, true);
        });
        EventEmitterHub_1.events.on('team:memberDeath', async (serverId, death) => {
            const msg = `💀 ${death.steamId} was killed by ${death.killerName || 'unknown'}`;
            await this.sendDiscordAlert(serverId, `💀 Team Death`, msg, 0x8B0000);
        });
        EventEmitterHub_1.events.on('fcm:pairing', async (payload) => {
            console.log('[NotificationService] Pairing request received:', payload);
            try {
                const port = parseInt(payload.port, 10);
                let server = await client_1.prisma.server.findFirst({ where: { ip: payload.ip, port } });
                if (!server && payload.playerToken) {
                    server = await client_1.prisma.server.create({
                        data: {
                            ip: payload.ip,
                            port,
                            appPort: port,
                            name: payload.desc || payload.name,
                            steamId: payload.playerId,
                            playerToken: payload.playerToken,
                            isActive: true
                        }
                    });
                    RustPlusManager_1.rustPlusManager.addServer(server.id, server.ip, server.port, server.steamId, server.playerToken);
                    RustPlusManager_1.rustPlusManager.getServer(server.id)?.connect();
                    console.log(`[NotificationService] Automatically paired to new server: ${server.name}`);
                }
            }
            catch (e) {
                console.error('[NotificationService] Failed to handle pairing:', e);
            }
        });
    }
    async sendDiscordAlert(serverId, title, message, color = 0xFFA500, speak = false) {
        try {
            const server = await client_1.prisma.server.findUnique({ where: { id: serverId } });
            if (!server || !server.alertChannelId)
                return;
            const channel = await DiscordBot_1.discordBot.client.channels.fetch(server.alertChannelId);
            if (channel && channel.isTextBased()) {
                const embed = new discord_js_1.EmbedBuilder()
                    .setTitle(title)
                    .setDescription(message)
                    .setColor(color)
                    .setTimestamp();
                await channel.send({ embeds: [embed] });
                if (speak && process.env.TTS_ENABLED === 'true') {
                    await VoiceClient_1.voiceClient.speak(channel.guild.id, message);
                }
            }
        }
        catch (e) {
            console.error(`[NotificationService] Error sending discord alert:`, e);
        }
    }
    formatEventMessage(type) {
        switch (type) {
            case 'heli': return '🚁 Patrol Helicopter inbound!';
            case 'cargo': return '🚢 Cargo Ship is in the waters!';
            case 'chinook': return '🚁 Chinook is dropping a locked crate!';
            case 'locked_crate': return '📦 Locked crate has been dropped!';
            case 'oil_rig_small': return '🛢️ Small Oil Rig crate is being hacked!';
            case 'oil_rig_large': return '🛢️ Large Oil Rig crate is being hacked!';
            case 'deep_sea': return '🌊 Deep sea event detected!';
            default: return null;
        }
    }
}
exports.NotificationService = NotificationService;
exports.notificationService = new NotificationService();
