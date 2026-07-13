import { Command, CommandContext } from './CommandRouter';
import { getGameTime } from '../../utils/time';

export class NightCommand implements Command {
  name = 'night';
  aliases = ['time', 'day'];
  description = 'Shows game time and time until night/day';
  usage = '!night';
  cooldown = 5;

  async execute(ctx: CommandContext): Promise<string> {
    const info = await ctx.rustplus.getServerInfo();
    // Assuming we have a util function to parse env.time (which is a float representing hours e.g. 14.5 = 14:30)
    const { timeString, timeUntilNight, timeUntilDay, isNight } = getGameTime(info.env.time, info.env.sunrise, info.env.sunset);
    
    if (isNight) {
      return `🌙 It is currently ${timeString}. Day begins in ${timeUntilDay} real minutes.`;
    } else {
      return `☀️ It is currently ${timeString}. Night begins in ${timeUntilNight} real minutes.`;
    }
  }
}
