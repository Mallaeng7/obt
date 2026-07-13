import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { prisma } from '../../database/client';

export default {
  data: new SlashCommandBuilder()
    .setName('events')
    .setDescription('Show recent server events (Heli, Cargo, etc.)'),
    
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    // Just pull from the first server associated with this guild for now
    const server = await prisma.server.findFirst({
      where: { discordGuildId: interaction.guildId }
    });

    if (!server) return interaction.followUp('No servers paired with this Discord server.');

    const events = await prisma.serverEvent.findMany({
      where: { serverId: server.id },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    if (events.length === 0) return interaction.followUp('No recent events recorded.');

    const embed = new EmbedBuilder()
      .setTitle(`Recent Events - ${server.name}`)
      .setColor(0x0099FF);

    let desc = '';
    for (const e of events) {
      const mins = Math.floor((Date.now() - e.createdAt.getTime()) / 60000);
      const icon = getIcon(e.type);
      desc += `${icon} **${e.type}** - ${mins} mins ago\n`;
    }

    embed.setDescription(desc);
    await interaction.followUp({ embeds: [embed] });
  }
};

function getIcon(type: string): string {
  const icons: Record<string, string> = {
    'heli': '🚁',
    'cargo': '🚢',
    'chinook': '🚁',
    'locked_crate': '📦',
    'oil_rig_small': '🛢️',
    'oil_rig_large': '🛢️',
    'deep_sea': '🌊'
  };
  return icons[type] || '✨';
}
