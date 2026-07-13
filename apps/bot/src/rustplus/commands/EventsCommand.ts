import { Command, CommandContext } from './CommandRouter';
import { prisma } from '../../database/client';

export class EventsCommand implements Command {
  name = 'events';
  aliases = ['event'];
  description = 'Shows recently occurred server events';
  usage = '!events';
  cooldown = 10;

  async execute(ctx: CommandContext): Promise<string> {
    const events = await prisma.serverEvent.findMany({
      where: { serverId: ctx.serverId },
      orderBy: { createdAt: 'desc' },
      distinct: ['type'],
      take: 5
    });

    if (events.length === 0) return 'No recent events recorded.';

    const lines = events.map(e => {
      const mins = Math.floor((Date.now() - e.createdAt.getTime()) / 60000);
      const icon = this.getIcon(e.type);
      return `${icon} ${e.type}: ${mins} mins ago`;
    });

    return `Recent Events:\n${lines.join('\n')}`;
  }

  private getIcon(type: string): string {
    const icons: Record<string, string> = {
      'heli': '🚁',
      'cargo': '🚢',
      'chinook': '🚁',
      'locked_crate': '📦',
      'oil_rig_small': '🛢️',
      'oil_rig_large': '🛢️',
      'deep_sea': '🌊'
    };
    return icons[type] || '✨';
  }
}
