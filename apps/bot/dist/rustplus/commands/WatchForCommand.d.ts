import { Command, CommandContext } from './CommandRouter';
export declare class WatchForCommand implements Command {
    name: string;
    aliases: string[];
    description: string;
    usage: string;
    cooldown: number;
    execute(ctx: CommandContext): Promise<string>;
}
//# sourceMappingURL=WatchForCommand.d.ts.map