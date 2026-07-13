import { Command, CommandContext } from './CommandRouter';

export class VendCommand implements Command {
  name = 'vend';
  aliases = ['vending'];
  description = 'Searches vending machines for an item';
  usage = '!vend <item_name>';
  cooldown = 5;

  async execute(ctx: CommandContext): Promise<string> {
    if (ctx.args.length < 2) return '❌ Usage: !vend <item_name>';
    const search = ctx.args.slice(1).join(' ').toLowerCase();

    const markers = await ctx.rustplus.getMapMarkers();
    const vendingMachines = markers.filter((m: any) => m.type === 'VendingMachine');

    const results: string[] = [];

    for (const vm of vendingMachines) {
      if (vm.sellOrders) {
        for (const order of vm.sellOrders) {
          // Typically order.itemName or order.itemId is present. 
          // We assume we have a parsed name or id we can match
          const itemName = (order.itemName || '').toLowerCase(); // placeholder logic
          if (itemName.includes(search)) {
            results.push(`- ${vm.name} at [${Math.floor(vm.x)}, ${Math.floor(vm.y)}]: ${order.quantity}x for ${order.costAmount} ${order.costItem}`);
          }
        }
      }
    }

    if (results.length === 0) return `❌ No vending machines selling '${search}'.`;

    return `🛒 Vending Machines selling '${search}':\n${results.slice(0, 5).join('\n')}${results.length > 5 ? `\n...and ${results.length - 5} more.` : ''}`;
  }
}
