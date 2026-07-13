import { Command, CommandContext } from './CommandRouter';
export declare class PromoteCommand implements Command {
    name: string;
    aliases: string[];
    description: string;
    usage: string;
    cooldown: number;
    execute(ctx: CommandContext): Promise<string>;
}
//# sourceMappingURL=PromoteCommand.d.ts.map