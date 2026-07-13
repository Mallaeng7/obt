import { Command, CommandContext } from './CommandRouter';
export declare class TeamStatsCommand implements Command {
    name: string;
    aliases: string[];
    description: string;
    usage: string;
    cooldown: number;
    execute(ctx: CommandContext): Promise<string>;
}
//# sourceMappingURL=TeamStatsCommand.d.ts.map