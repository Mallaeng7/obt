import { Command, CommandContext } from './CommandRouter';
import { findItem, getRecycleData } from '@obt/rust-data';

export class RecycleCommand implements Command {
  name = 'recycle';
  aliases = ['rec'];
  description = 'Calculates recycling output';
  usage = '!recycle <amount> <item_name>';
  cooldown = 3;

  async execute(ctx: CommandContext): Promise<string> {
    if (ctx.args.length < 3) return '❌ Usage: !recycle <amount> <item_name>';
    
    const amount = parseInt(ctx.args[1], 10);
    if (isNaN(amount) || amount <= 0) return '❌ Invalid amount.';

    const itemName = ctx.args.slice(2).join(' ');
    const item = findItem(itemName);

    if (!item) return `❌ Item '${itemName}' not found.`;

    const recycleData = getRecycleData();
    const output = (recycleData as any)[item.name];

    if (!output) return `❌ '${item.displayName}' cannot be recycled.`;

    const resultStr = output.map((o: any) => `${o.amount * amount}x ${o.itemName}`).join(', ');

    return `♻️ Recycling ${amount}x ${item.displayName} yields: ${resultStr}`;
  }
}
