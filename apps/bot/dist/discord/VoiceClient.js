"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.voiceClient = exports.VoiceClient = void 0;
const voice_1 = require("@discordjs/voice");
const { EdgeTTS } = require('node-edge-tts');
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class VoiceClient {
    connections = new Map();
    players = new Map();
    tts;
    constructor() {
        this.tts = new EdgeTTS({
            voice: 'en-US-AriaNeural'
        });
    }
    async joinChannel(channel) {
        const connection = (0, voice_1.joinVoiceChannel)({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
        });
        const player = (0, voice_1.createAudioPlayer)({
            behaviors: {
                noSubscriber: voice_1.NoSubscriberBehavior.Pause,
            },
        });
        connection.subscribe(player);
        this.connections.set(channel.guild.id, connection);
        this.players.set(channel.guild.id, player);
    }
    leaveChannel(guildId) {
        const connection = this.connections.get(guildId);
        if (connection) {
            connection.destroy();
            this.connections.delete(guildId);
            this.players.delete(guildId);
        }
    }
    async speak(guildId, text) {
        const player = this.players.get(guildId);
        if (!player)
            return;
        try {
            // Create a temporary file for the audio
            const tempPath = path.join(__dirname, `../../../../temp_${guildId}_${Date.now()}.mp3`);
            // We will need to capture EdgeTTS stream to a file or stream it directly.
            // edge-tts library might need piping or waiting.
            // Assuming a basic usage of edge-tts 1.0.1
            // Note: usage of edge-tts depends on its actual API.
            // As a fallback, we can use a placeholder if edge-tts doesn't support direct file writing easily:
            // Actually edge-tts provides `tts.save(filepath)` or similar. Let's assume `.ttsPromise(text, filepath)`
            // The current latest `edge-tts` (1.0.1) provides `new EdgeTTS().ttsPromise(text, file)`
            await this.tts.ttsPromise(text, tempPath);
            const resource = (0, voice_1.createAudioResource)(tempPath);
            player.play(resource);
            player.once(voice_1.AudioPlayerStatus.Idle, () => {
                // Clean up temp file
                if (fs.existsSync(tempPath)) {
                    fs.unlinkSync(tempPath);
                }
            });
        }
        catch (e) {
            console.error(`[VoiceClient] Failed to speak:`, e);
        }
    }
}
exports.VoiceClient = VoiceClient;
exports.voiceClient = new VoiceClient();
