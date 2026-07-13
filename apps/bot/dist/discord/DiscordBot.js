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
exports.discordBot = exports.DiscordBot = void 0;
const discord_js_1 = require("discord.js");
const env_1 = require("../config/env"); // Need to create config wrapper
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class DiscordBot {
    client;
    commands = new discord_js_1.Collection();
    constructor() {
        this.client = new discord_js_1.Client({
            intents: [
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildMessages,
                discord_js_1.GatewayIntentBits.GuildVoiceStates,
                discord_js_1.GatewayIntentBits.MessageContent,
            ],
            partials: [discord_js_1.Partials.Message, discord_js_1.Partials.Channel]
        });
        this.registerEvents();
    }
    registerEvents() {
        this.client.once('ready', () => {
            console.log(`[Discord] Logged in as ${this.client.user?.tag}`);
        });
        this.client.on('interactionCreate', async (interaction) => {
            if (!interaction.isChatInputCommand())
                return;
            const command = this.commands.get(interaction.commandName);
            if (!command)
                return;
            try {
                await command.execute(interaction);
            }
            catch (error) {
                console.error(`[Discord] Error executing command ${interaction.commandName}:`, error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                }
                else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        });
    }
    async loadCommands() {
        // Basic dynamic command loader
        const commandsPath = path.join(__dirname, 'commands');
        if (!fs.existsSync(commandsPath))
            return;
        const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        const slashCommands = [];
        for (const file of commandFiles) {
            if (file === 'index.ts' || file === 'index.js')
                continue;
            const filePath = path.join(commandsPath, file);
            const { default: command } = await Promise.resolve(`${filePath}`).then(s => __importStar(require(s)));
            if (command && 'data' in command && 'execute' in command) {
                this.commands.set(command.data.name, command);
                slashCommands.push(command.data.toJSON());
            }
        }
        if (env_1.env.DISCORD_BOT_TOKEN && env_1.env.DISCORD_APPLICATION_ID && env_1.env.DISCORD_GUILD_ID) {
            const rest = new discord_js_1.REST({ version: '10' }).setToken(env_1.env.DISCORD_BOT_TOKEN);
            try {
                console.log(`[Discord] Started refreshing ${slashCommands.length} application (/) commands.`);
                await rest.put(discord_js_1.Routes.applicationGuildCommands(env_1.env.DISCORD_APPLICATION_ID, env_1.env.DISCORD_GUILD_ID), { body: slashCommands });
                console.log('[Discord] Successfully reloaded application (/) commands.');
            }
            catch (error) {
                console.error('[Discord] Error refreshing commands:', error);
            }
        }
    }
    async start() {
        if (!env_1.env.DISCORD_BOT_TOKEN) {
            console.warn('[Discord] DISCORD_BOT_TOKEN not provided, skipping discord bot startup.');
            return;
        }
        await this.loadCommands();
        await this.client.login(env_1.env.DISCORD_BOT_TOKEN);
    }
}
exports.DiscordBot = DiscordBot;
exports.discordBot = new DiscordBot();
