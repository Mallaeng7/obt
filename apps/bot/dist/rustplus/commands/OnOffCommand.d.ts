import { Command, CommandContext } from './CommandRouter';
export declare class OnOffCommand implements Command {
    name: string;
    aliases: string[];
    description: string;
    usage: string;
    cooldown: number;
    execute(ctx: CommandContext): Promise<string>;
}
//# sourceMappingURL=OnOffCommand.d.ts.map