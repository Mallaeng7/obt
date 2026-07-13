import { Command, CommandContext } from './CommandRouter';
import { prisma } from '../../database/client';

export class WatchForCommand implements Command {
  name = 'watchfor';
  aliases = ['watch'];
  description = 'Receive a notification when an item is added to a vending machine';
  usage = '!watchfor <item_name>';
  cooldown = 5;

  async execute(ctx: CommandContext): Promise<string> {
    if (ctx.args.length < 2) return '❌ Usage: !watchfor <item_name>';
    const search = ctx.args.slice(1).join(' ').toLowerCase();

    await prisma.watchItem.create({
      data: {
        itemName: search,
        requestedBy: ctx.senderSteamId,
        serverId: ctx.serverId
      }
    });

    return `👀 Now watching for vending machines selling '${search}'.`;
  }
}
