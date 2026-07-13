import { Client, Collection } from 'discord.js';
export declare class DiscordBot {
    client: Client;
    commands: Collection<string, any>;
    constructor();
    private registerEvents;
    loadCommands(): Promise<void>;
    start(): Promise<void>;
}
export declare const discordBot: DiscordBot;
//# sourceMappingURL=DiscordBot.d.ts.map