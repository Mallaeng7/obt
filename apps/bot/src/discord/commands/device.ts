import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { prisma } from '../../database/client';
import { rustPlusManager } from '../../core/RustPlusManager';

export default {
  data: new SlashCommandBuilder()
    .setName('device')
    .setDescription('Control smart devices on the server.')
    .addSubcommand(subcommand =>
      subcommand.setName('on').setDescription('Turn a switch ON')
        .addStringOption(option => option.setName('name').setDescription('Name of the switch').setRequired(true))
    )
    .addSubcommand(subcommand =>
      subcommand.setName('off').setDescription('Turn a switch OFF')
        .addStringOption(option => option.setName('name').setDescription('Name of the switch').setRequired(true))
    )
    .addSubcommand(subcommand =>
      subcommand.setName('status').setDescription('Check status of a device')
        .addStringOption(option => option.setName('name').setDescription('Name of the device').setRequired(true))
    ),
    
  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const subCmd = interaction.options.getSubcommand();
    const name = interaction.options.getString('name', true);

    const devices = await prisma.device.findMany({
      where: { name: { contains: name, mode: 'insensitive' }, server: { discordGuildId: interaction.guildId } },
      include: { server: true }
    });

    if (devices.length === 0) return interaction.followUp(`Device '${name}' not found.`);
    if (devices.length > 1) return interaction.followUp(`Found multiple devices matching '${name}'. Please be more specific.`);

    const device = devices[0];
    const instance = rustPlusManager.getServer(device.serverId);

    if (!instance) return interaction.followUp(`Server '${device.server.name}' is currently disconnected.`);

    try {
      if (subCmd === 'on' || subCmd === 'off') {
        if (device.type !== 'switch') return interaction.followUp('Only switches can be toggled.');
        const turnOn = subCmd === 'on';
        await instance.client.setEntityValue(device.entityId, turnOn);
        return interaction.followUp(`🔌 Turned ${turnOn ? '🟢 ON' : '🔴 OFF'} '${device.name}'.`);
      } else if (subCmd === 'status') {
        const info = await instance.client.getEntityInfo(device.entityId);
        if (device.type === 'storage_monitor') {
          const capacity = info.payload?.capacity || 0;
          return interaction.followUp(`📦 Storage '${device.name}' Capacity: ${capacity}`);
        } else {
          const isOn = info.payload?.value === true;
          return interaction.followUp(`🔌 Device '${device.name}' is currently ${isOn ? '🟢 ON' : '🔴 OFF'}.`);
        }
      }
    } catch (e: any) {
      return interaction.followUp(`Failed to interact with device: ${e.message}`);
    }
  }
};
