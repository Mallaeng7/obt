"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const RustPlusManager_1 = require("../../core/RustPlusManager");
const client_1 = require("../../database/client");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('server')
        .setDescription('Get information about paired servers.')
        .addSubcommand(subcommand => subcommand
        .setName('info')
        .setDescription('Shows status of connected servers')),
    async execute(interaction) {
        await interaction.deferReply();
        const servers = await client_1.prisma.server.findMany({
            where: { discordGuildId: interaction.guildId }
        });
        if (servers.length === 0) {
            return interaction.followUp('No servers are paired with this Discord server.');
        }
        const embeds = await Promise.all(servers.map(async (dbServer) => {
            const instance = RustPlusManager_1.rustPlusManager.getServer(dbServer.id);
            let status = '🔴 Offline / Not Connected';
            let details = '';
            if (instance) {
                try {
                    const info = await instance.client.getServerInfo();
                    status = '🟢 Connected';
                    details = `Players: ${info.players}/${info.maxPlayers}\nQueued: ${info.queuedPlayers}\nMap Size: ${info.mapSize}`;
                }
                catch (e) {
                    status = '🟡 Connected (Info Timeout)';
                }
            }
            return new discord_js_1.EmbedBuilder()
                .setTitle(`Server: ${dbServer.name}`)
                .setColor(status.startsWith('🟢') ? 0x00FF00 : 0xFF0000)
                .addFields({ name: 'Status', value: status, inline: true }, { name: 'IP', value: `${dbServer.ip}:${dbServer.appPort}`, inline: true }, { name: 'Info', value: details || 'N/A', inline: false });
        }));
        await interaction.followUp({ embeds });
    }
};
