import { Command, CommandContext } from './CommandRouter';
export declare class DecayCommand implements Command {
    name: string;
    aliases: never[];
    description: string;
    usage: string;
    cooldown: number;
    execute(ctx: CommandContext): Promise<string>;
}
//# sourceMappingURL=DecayCommand.d.ts.map