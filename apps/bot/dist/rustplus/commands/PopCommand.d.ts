import { Command, CommandContext } from './CommandRouter';
export declare class PopCommand implements Command {
    name: string;
    aliases: string[];
    description: string;
    usage: string;
    cooldown: number;
    execute(ctx: CommandContext): Promise<string>;
}
//# sourceMappingURL=PopCommand.d.ts.map