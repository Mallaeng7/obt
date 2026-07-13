"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const client_1 = require("../../database/client");
const RustPlusManager_1 = require("../../core/RustPlusManager");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('vend')
        .setDescription('Search vending machines for an item.')
        .addStringOption(option => option.setName('item')
        .setDescription('Item to search for')
        .setRequired(true)),
    async execute(interaction) {
        await interaction.deferReply();
        const search = interaction.options.getString('item', true).toLowerCase();
        const server = await client_1.prisma.server.findFirst({
            where: { discordGuildId: interaction.guildId }
        });
        if (!server)
            return interaction.followUp('No servers paired with this Discord server.');
        const instance = RustPlusManager_1.rustPlusManager.getServer(server.id);
        if (!instance)
            return interaction.followUp('Server is not connected.');
        try {
            const markers = await instance.client.getMapMarkers();
            const vendingMachines = markers.filter((m) => m.type === 'VendingMachine');
            const results = [];
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
            if (results.length === 0)
                return interaction.followUp(`❌ No vending machines selling '${search}'.`);
            const embed = new discord_js_1.EmbedBuilder()
                .setTitle(`Vending Machines selling '${search}'`)
                .setColor(0xFFA500)
                .setDescription(results.slice(0, 10).join('\n') + (results.length > 10 ? `\n...and ${results.length - 10} more.` : ''));
            await interaction.followUp({ embeds: [embed] });
        }
        catch (e) {
            await interaction.followUp(`Failed to fetch vending machines: ${e.message}`);
        }
    }
};
