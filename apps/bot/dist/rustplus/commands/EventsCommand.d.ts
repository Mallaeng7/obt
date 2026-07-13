import { Command, CommandContext } from './CommandRouter';
export declare class EventsCommand implements Command {
    name: string;
    aliases: string[];
    description: string;
    usage: string;
    cooldown: number;
    execute(ctx: CommandContext): Promise<string>;
    private getIcon;
}
//# sourceMappingURL=EventsCommand.d.ts.map