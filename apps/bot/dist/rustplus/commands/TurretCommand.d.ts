import { Command, CommandContext } from './CommandRouter';
export declare class TurretCommand implements Command {
    name: string;
    aliases: string[];
    description: string;
    usage: string;
    cooldown: number;
    execute(ctx: CommandContext): Promise<string>;
}
//# sourceMappingURL=TurretCommand.d.ts.map