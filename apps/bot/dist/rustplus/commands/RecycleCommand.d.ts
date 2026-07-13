import { Command, CommandContext } from './CommandRouter';
export declare class RecycleCommand implements Command {
    name: string;
    aliases: string[];
    description: string;
    usage: string;
    cooldown: number;
    execute(ctx: CommandContext): Promise<string>;
}
//# sourceMappingURL=RecycleCommand.d.ts.map