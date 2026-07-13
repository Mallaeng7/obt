import { Client, GatewayIntentBits, Partials, Collection, REST, Routes } from 'discord.js';
import { env } from '../config/env'; // Need to create config wrapper
import * as path from 'path';
import * as fs from 'fs';

export class DiscordBot {
  public client: Client;
  public commands: Collection<string, any> = new Collection();

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
      ],
      partials: [Partials.Message, Partials.Channel]
    });

    this.registerEvents();
  }

  private registerEvents() {
    this.client.once('ready', () => {
      console.log(`[Discord] Logged in as ${this.client.user?.tag}`);
    });

    this.client.on('interactionCreate', async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const command = this.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`[Discord] Error executing command ${interaction.commandName}:`, error);
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
          await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
      }
    });
  }

  public async loadCommands() {
    // Basic dynamic command loader
    const commandsPath = path.join(__dirname, 'commands');
    if (!fs.existsSync(commandsPath)) return;

    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
    const slashCommands: any[] = [];

    for (const file of commandFiles) {
      if (file === 'index.ts' || file === 'index.js') continue;
      const filePath = path.join(commandsPath, file);
      const { default: command } = await import(filePath);
      
      if (command && 'data' in command && 'execute' in command) {
        this.commands.set(command.data.name, command);
        slashCommands.push(command.data.toJSON());
      }
    }

    if (env.DISCORD_BOT_TOKEN && env.DISCORD_APPLICATION_ID && env.DISCORD_GUILD_ID) {
      const rest = new REST({ version: '10' }).setToken(env.DISCORD_BOT_TOKEN);
      try {
        console.log(`[Discord] Started refreshing ${slashCommands.length} application (/) commands.`);
        await rest.put(
          Routes.applicationGuildCommands(env.DISCORD_APPLICATION_ID, env.DISCORD_GUILD_ID),
          { body: slashCommands },
        );
        console.log('[Discord] Successfully reloaded application (/) commands.');
      } catch (error) {
        console.error('[Discord] Error refreshing commands:', error);
      }
    }
  }

  public async start() {
    if (!env.DISCORD_BOT_TOKEN) {
      console.warn('[Discord] DISCORD_BOT_TOKEN not provided, skipping discord bot startup.');
      return;
    }
    await this.loadCommands();
    await this.client.login(env.DISCORD_BOT_TOKEN);
  }
}

export const discordBot = new DiscordBot();
