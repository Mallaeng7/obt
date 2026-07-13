import { Command, CommandContext } from './CommandRouter';
export declare class NightCommand implements Command {
    name: string;
    aliases: string[];
    description: string;
    usage: string;
    cooldown: number;
    execute(ctx: CommandContext): Promise<string>;
}
//# sourceMappingURL=NightCommand.d.ts.map