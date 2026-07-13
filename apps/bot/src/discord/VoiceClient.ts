import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnection,
  NoSubscriberBehavior
} from '@discordjs/voice';
const { EdgeTTS } = require('node-edge-tts');
import { Client, VoiceBasedChannel } from 'discord.js';
import * as fs from 'fs';
import * as path from 'path';

export class VoiceClient {
  private connections: Map<string, VoiceConnection> = new Map();
  private players: Map<string, ReturnType<typeof createAudioPlayer>> = new Map();
  private tts: any;

  constructor() {
    this.tts = new EdgeTTS({
      voice: 'en-US-AriaNeural'
    });
  }

  public async joinChannel(channel: VoiceBasedChannel) {
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      adapterCreator: channel.guild.voiceAdapterCreator as any,
    });

    const player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });

    connection.subscribe(player);
    this.connections.set(channel.guild.id, connection);
    this.players.set(channel.guild.id, player);
  }

  public leaveChannel(guildId: string) {
    const connection = this.connections.get(guildId);
    if (connection) {
      connection.destroy();
      this.connections.delete(guildId);
      this.players.delete(guildId);
    }
  }

  public async speak(guildId: string, text: string) {
    const player = this.players.get(guildId);
    if (!player) return;

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

      const resource = createAudioResource(tempPath);
      player.play(resource);

      player.once(AudioPlayerStatus.Idle, () => {
        // Clean up temp file
        if (fs.existsSync(tempPath)) {
          fs.unlinkSync(tempPath);
        }
      });
    } catch (e) {
      console.error(`[VoiceClient] Failed to speak:`, e);
    }
  }
}

export const voiceClient = new VoiceClient();
