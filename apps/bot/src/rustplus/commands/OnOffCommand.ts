import { Command, CommandContext } from './CommandRouter';
import { prisma } from '../../database/client';

export class OnOffCommand implements Command {
  name = 'on'; // or 'off' depending on context, handled by router alias
  aliases = ['off', 'toggle'];
  description = 'Turns a paired smart switch on or off';
  usage = '!on <device_name>';
  cooldown = 2;

  async execute(ctx: CommandContext): Promise<string> {
    const cmd = ctx.args[0].toLowerCase();
    if (ctx.args.length < 2) return `❌ Usage: !${cmd} <device_name>`;
    
    const name = ctx.args.slice(1).join(' ');

    const device = await prisma.device.findFirst({
      where: { serverId: ctx.serverId, name: { contains: name, mode: 'insensitive' }, type: 'switch' }
    });

    if (!device) return `❌ Switch '${name}' not found.`;

    try {
      let turnOn = cmd === 'on';
      if (cmd === 'toggle') {
        const info = await ctx.rustplus.getEntityInfo(device.entityId);
        turnOn = !(info.payload?.value === true);
      }

      await ctx.rustplus.setEntityValue(device.entityId, turnOn);
      return `🔌 Turned ${turnOn ? '🟢 ON' : '🔴 OFF'} '${device.name}'.`;
    } catch (e) {
      return `❌ Failed to toggle '${device.name}'.`;
    }
  }
}
