import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { prisma } from '../../database/client';
import { rustPlusManager } from '../../core/RustPlusManager';

export default {
  data: new SlashCommandBuilder()
    .setName('vend')
    .setDescription('Search vending machines for an item.')
    .addStringOption(option => 
      option.setName('item')
        .setDescription('Item to search for')
        .setRequired(true)),
        
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const search = interaction.options.getString('item', true).toLowerCase();

    const server = await prisma.server.findFirst({
      where: { discordGuildId: interaction.guildId }
    });

    if (!server) return interaction.followUp('No servers paired with this Discord server.');

    const instance = rustPlusManager.getServer(server.id);
    if (!instance) return interaction.followUp('Server is not connected.');

    try {
      const markers = await instance.client.getMapMarkers();
      const vendingMachines = markers.filter((m: any) => m.type === 'VendingMachine');
      
      const results: string[] = [];

      for (const vm of vendingMachines) {
        if (vm.sellOrders) {
          for (const order of vm.sellOrders) {
            const itemName = (order.itemName || '').toLowerCase(); // Note: adjust based on actual payload
            if (itemName.includes(search)) {
              results.push(`**${vm.name}** [${Math.floor(vm.x)}, ${Math.floor(vm.y)}]: ${order.quantity}x for ${order.costAmount} ${order.costItem}`);
            }
          }
        }
      }

      if (results.length === 0) return interaction.followUp(`❌ No vending machines selling '${search}'.`);

      const embed = new EmbedBuilder()
        .setTitle(`Vending Machines selling '${search}'`)
        .setColor(0xFFA500)
        .setDescription(results.slice(0, 10).join('\n') + (results.length > 10 ? `\n...and ${results.length - 10} more.` : ''));

      await interaction.followUp({ embeds: [embed] });
    } catch (e: any) {
      await interaction.followUp(`Failed to fetch vending machines: ${e.message}`);
    }
  }
};
