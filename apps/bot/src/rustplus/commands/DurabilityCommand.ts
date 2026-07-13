import { Command, CommandContext } from './CommandRouter';
import { getBuilding, getRaidCosts } from '@obt/rust-data';

export class DurabilityCommand implements Command {
  name = 'durability';
  aliases = ['raid', 'cost'];
  description = 'Shows raid costs for a building block or item';
  usage = '!durability <target>';
  cooldown = 5;

  async execute(ctx: CommandContext): Promise<string> {
    if (ctx.args.length < 2) return '❌ Usage: !durability <target>';
    
    const targetName = ctx.args.slice(1).join(' ');
    const building = getBuilding(targetName);

    if (!building) return `❌ Target '${targetName}' not found.`;

    const raidCosts = getRaidCosts();
    const costs = (raidCosts as any)[building.name];

    if (!costs) return `❌ No raid data for '${building.name}'.`;

    const lines = costs.map((c: any) => `- ${c.amount}x ${c.weapon} (${c.sulfur} sulfur)`);

    return `💥 Raid costs for ${building.name} (${building.hp} HP):\n${lines.join('\n')}`;
  }
}
