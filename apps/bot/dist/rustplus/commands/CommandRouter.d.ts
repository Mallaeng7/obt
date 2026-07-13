import { RustPlusClient } from '../RustPlusClient';
export interface CommandContext {
    serverId: string;
    senderSteamId: string;
    senderName: string;
    args: string[];
    rustplus: RustPlusClient;
}
export interface Command {
    name: string;
    aliases: string[];
    description: string;
    usage: string;
    cooldown: number;
    execute(ctx: CommandContext): Promise<string | null>;
}
export declare class CommandRouter {
    private commands;
    private cooldowns;
    register(cmd: Command): void;
    dispatch(ctx: CommandContext): Promise<string | null>;
}
export declare const commandRouter: CommandRouter;
//# sourceMappingURL=CommandRouter.d.ts.map