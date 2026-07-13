import { Command, CommandContext } from './CommandRouter';
import { getBuilding } from '@obt/rust-data';

export class DecayCommand implements Command {
  name = 'decay';
  aliases = [];
  description = 'Calculates remaining decay time for a building block based on current HP';
  usage = '!decay <hp> <building_block>';
  cooldown = 3;

  async execute(ctx: CommandContext): Promise<string> {
    if (ctx.args.length < 3) return '❌ Usage: !decay <hp> <building_block>';
    
    const hp = parseInt(ctx.args[1], 10);
    if (isNaN(hp) || hp < 0) return '❌ Invalid HP.';

    const targetName = ctx.args.slice(2).join(' ');
    const building = getBuilding(targetName);

    if (!building) return `❌ Target '${targetName}' not found.`;
    if (!building.decayTimeHrs) return `❌ '${building.name}' does not decay or data is missing.`;

    // Formula: (Current HP / Max HP) * Total Decay Time
    const ratio = hp / building.hp;
    const remainingHrs = ratio * building.decayTimeHrs;
    
    const h = Math.floor(remainingHrs);
    const m = Math.floor((remainingHrs - h) * 60);

    return `⏳ ${building.name} with ${hp} HP will decay in ~${h}h ${m}m.`;
  }
}
