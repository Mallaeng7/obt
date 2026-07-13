"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandRouter = exports.CommandRouter = void 0;
class CommandRouter {
    commands = new Map();
    cooldowns = new Map();
    register(cmd) {
        this.commands.set(cmd.name, cmd);
        for (const alias of cmd.aliases) {
            this.commands.set(alias, cmd);
        }
    }
    async dispatch(ctx) {
        const cmdName = ctx.args[0]?.toLowerCase();
        if (!cmdName)
            return null;
        const cmd = this.commands.get(cmdName);
        if (!cmd)
            return null;
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
        }
        catch (error) {
            console.error(`[CommandRouter] Error executing ${cmd.name}:`, error);
            return `❌ Error: ${error.message}`;
        }
    }
}
exports.CommandRouter = CommandRouter;
exports.commandRouter = new CommandRouter();
