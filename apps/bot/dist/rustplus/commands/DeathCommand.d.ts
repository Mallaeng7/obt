import { Command, CommandContext } from './CommandRouter';
export declare class DeathCommand implements Command {
    name: string;
    aliases: string[];
    description: string;
    usage: string;
    cooldown: number;
    execute(ctx: CommandContext): Promise<string>;
}
//# sourceMappingURL=DeathCommand.d.ts.map