import { Command, CommandContext } from './CommandRouter';
import { findItem } from '@obt/rust-data';

export class CraftCommand implements Command {
  name = 'craft';
  aliases = ['c'];
  description = 'Calculates crafting cost and time';
  usage = '!craft <amount> <item_name>';
  cooldown = 3;

  async execute(ctx: CommandContext): Promise<string> {
    if (ctx.args.length < 3) return '❌ Usage: !craft <amount> <item_name>';
    
    const amountStr = ctx.args[1];
    const amount = parseInt(amountStr, 10);
    if (isNaN(amount) || amount <= 0) return '❌ Invalid amount.';

    const itemName = ctx.args.slice(2).join(' ');
    const item = findItem(itemName);

    if (!item) return `❌ Item '${itemName}' not found.`;
    if (!item.craftTime) return `❌ '${item.displayName}' is not craftable.`;

    const totalTime = amount * item.craftTime;
    const timeStr = totalTime > 60 ? `${Math.floor(totalTime/60)}m ${totalTime%60}s` : `${totalTime}s`;

    return `🛠️ Crafting ${amount}x ${item.displayName} takes ${timeStr}.`;
  }
}
