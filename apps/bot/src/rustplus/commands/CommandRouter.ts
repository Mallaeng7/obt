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
  cooldown: number; // in seconds
  execute(ctx: CommandContext): Promise<string | null>;
}

export class CommandRouter {
  private commands: Map<string, Command> = new Map();
  private cooldowns: Map<string, number> = new Map();

  public register(cmd: Command) {
    this.commands.set(cmd.name, cmd);
    for (const alias of cmd.aliases) {
      this.commands.set(alias, cmd);
    }
  }

  public async dispatch(ctx: CommandContext): Promise<string | null> {
    const cmdName = ctx.args[0]?.toLowerCase();
    if (!cmdName) return null;

    const cmd = this.commands.get(cmdName);
    if (!cmd) return null;

    // Cooldown check
    const cooldownKey = `${ctx.serverId}:${ctx.senderSteamId}:${cmd.name}`;
    const now = Date.now();
    const lastUsed = this.cooldowns.get(cooldownKey) || 0;
    if (now - lastUsed < cmd.cooldown * 1000) {
      return `⏳ Please wait ${Math.ceil((cmd.cooldown * 1000 - (now - lastUsed)) / 1000)}s before using this command again.`;
    }

    this.cooldowns.set(cooldownKey, now);

    try {
      return await cmd.execute(ctx);
    } catch (error: any) {
      console.error(`[CommandRouter] Error executing ${cmd.name}:`, error);
      return `❌ Error: ${error.message}`;
    }
  }
}

export const commandRouter = new CommandRouter();
