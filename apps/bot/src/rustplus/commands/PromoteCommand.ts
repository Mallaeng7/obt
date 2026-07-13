import { Command, CommandContext } from './CommandRouter';

export class PromoteCommand implements Command {
  name = 'promote';
  aliases = ['leader'];
  description = 'Promotes a team member to team leader';
  usage = '!promote <name>';
  cooldown = 10;

  async execute(ctx: CommandContext): Promise<string> {
    if (ctx.args.length < 2) return '❌ Usage: !promote <name>';
    const name = ctx.args.slice(1).join(' ').toLowerCase();

    try {
      const team = await ctx.rustplus.getTeamInfo();
      const member = team.members.find((m: any) => m.name.toLowerCase().includes(name));
      
      if (!member) return `❌ Team member '${name}' not found.`;
      
      // Promote team member to leader
      await ctx.rustplus.client.promoteToLeader(member.steamId);
      
      return `👑 ${member.name} has been promoted to Team Leader.`;
    } catch (e) {
      return '❌ Failed to promote team member. Am I the leader?';
    }
  }
}
