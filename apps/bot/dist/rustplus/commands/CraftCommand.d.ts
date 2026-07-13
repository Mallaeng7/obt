import { Command, CommandContext } from './CommandRouter';
export declare class CraftCommand implements Command {
    name: string;
    aliases: string[];
    description: string;
    usage: string;
    cooldown: number;
    execute(ctx: CommandContext): Promise<string>;
}
//# sourceMappingURL=CraftCommand.d.ts.map