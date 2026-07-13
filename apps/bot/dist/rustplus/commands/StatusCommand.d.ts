import { Command, CommandContext } from './CommandRouter';
export declare class StatusCommand implements Command {
    name: string;
    aliases: string[];
    description: string;
    usage: string;
    cooldown: number;
    execute(ctx: CommandContext): Promise<string>;
}
//# sourceMappingURL=StatusCommand.d.ts.map