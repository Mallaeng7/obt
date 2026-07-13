import { Command, CommandContext } from './CommandRouter';
export declare class DurabilityCommand implements Command {
    name: string;
    aliases: string[];
    description: string;
    usage: string;
    cooldown: number;
    execute(ctx: CommandContext): Promise<string>;
}
//# sourceMappingURL=DurabilityCommand.d.ts.map