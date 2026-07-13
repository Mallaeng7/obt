import { Command, CommandContext } from './CommandRouter';
import { prisma } from '../../database/client';

export class TeamStatsCommand implements Command {
  name = 'teamstats';
  aliases = ['playtime-all', 'afktime-all'];
  description = 'Shows aggregated team statistics';
  usage = '!teamstats';
  cooldown = 10;

  async execute(ctx: CommandContext): Promise<string> {
    const members = await prisma.teamMember.findMany({
      where: { serverId: ctx.serverId },
      orderBy: { playTime: 'desc' }
    });

    if (members.length === 0) return 'No team stats recorded.';

    const cmd = ctx.args[0].toLowerCase();

    if (cmd === 'playtime-all') {
      const total = members.reduce((acc: any, m: any) => acc + m.playTime, 0);
      return `⏱️ Total Team Playtime: ${Math.floor(total / 60)}h ${total % 60}m\n` +
             members.slice(0, 5).map((m: any) => `- ${m.name}: ${Math.floor(m.playTime / 60)}h ${m.playTime % 60}m`).join('\n');
    }

    if (cmd === 'afktime-all') {
      const sorted = [...members].sort((a: any, b: any) => b.afkTime - a.afkTime);
      const total = sorted.reduce((acc: any, m: any) => acc + m.afkTime, 0);
      return `💤 Total Team AFK Time: ${Math.floor(total / 60)}h ${total % 60}m\n` +
             sorted.slice(0, 5).map((m: any) => `- ${m.name}: ${Math.floor(m.afkTime / 60)}h ${m.afkTime % 60}m`).join('\n');
    }

    // Default teamstats
    const totalPlay = members.reduce((acc: any, m: any) => acc + m.playTime, 0);
    const totalAfk = members.reduce((acc: any, m: any) => acc + m.afkTime, 0);
    const totalDeaths = members.reduce((acc: any, m: any) => acc + m.deathCount, 0);

    return `📊 Team Stats:
- ⏱️ Playtime: ${Math.floor(totalPlay / 60)}h
- 💤 AFK Time: ${Math.floor(totalAfk / 60)}h
- 💀 Total Deaths: ${totalDeaths}`;
  }
}
