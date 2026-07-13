import { VoiceBasedChannel } from 'discord.js';
export declare class VoiceClient {
    private connections;
    private players;
    private tts;
    constructor();
    joinChannel(channel: VoiceBasedChannel): Promise<void>;
    leaveChannel(guildId: string): void;
    speak(guildId: string, text: string): Promise<void>;
}
export declare const voiceClient: VoiceClient;
//# sourceMappingURL=VoiceClient.d.ts.map