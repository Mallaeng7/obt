import { Command, CommandContext } from './CommandRouter';

export class PopCommand implements Command {
  name = 'pop';
  aliases = ['population', 'players'];
  description = 'Shows current server population and queue';
  usage = '!pop';
  cooldown = 5;

  async execute(ctx: CommandContext): Promise<string> {
    const info = await ctx.rustplus.getServerInfo();
    return `👥 Players: ${info.players}/${info.maxPlayers} ${info.queuedPlayers > 0 ? `(Queue: ${info.queuedPlayers})` : ''}`;
  }
}
