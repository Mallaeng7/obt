import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { prisma } from '../../database/client';
import { rustPlusManager } from '../../core/RustPlusManager';

export default {
  data: new SlashCommandBuilder()
    .setName('pair')
    .setDescription('Pairs the bot with a Rust server using FCM credentials.')
    .addStringOption(option => 
      option.setName('ip')
        .setDescription('Server IP address')
        .setRequired(true))
    .addIntegerOption(option => 
      option.setName('port')
        .setDescription('Server App Port (usually game port + 67)')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('steamid')
        .setDescription('Your Steam ID used in the game')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('playertoken')
        .setDescription('Player token obtained from Rust+ app linking')
        .setRequired(true))
    .addStringOption(option => 
      option.setName('name')
        .setDescription('A nickname for this server')
        .setRequired(true)),
  
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    const ip = interaction.options.getString('ip', true);
    const port = interaction.options.getInteger('port', true);
    const steamId = interaction.options.getString('steamid', true);
    const playerToken = interaction.options.getString('playertoken', true);
    const name = interaction.options.getString('name', true);

    try {
      // 1. Create DB record
      const server = await prisma.server.create({
        data: {
          name,
          ip,
          port: port - 67, // game port estimate, but let's assume they entered app port
          appPort: port,
          steamId,
          playerToken, // Should encrypt this in production
          discordGuildId: interaction.guildId
        }
      });

      // 2. Add to Manager and Connect
      await rustPlusManager.addServer(server.id, server.ip, server.appPort, server.steamId, server.playerToken);

      await interaction.followUp(`Successfully paired and connecting to server **${name}**!`);
    } catch (error: any) {
      console.error(error);
      await interaction.followUp(`Failed to pair: ${error.message}`);
    }
  }
};
