"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TurretCommand = void 0;
const client_1 = require("../../database/client");
const grid_1 = require("../../utils/grid");
class TurretCommand {
    name = 'turret-add';
    aliases = ['turret-check'];
    description = 'Manage and check auto turret interference map';
    usage = '!turret-add <floor> | !turret-check';
    cooldown = 5;
    async execute(ctx) {
        const cmd = ctx.args[0].toLowerCase();
        // Get current player position
        let me = null;
        try {
            const team = await ctx.rustplus.getTeamInfo();
            me = team.members.find((m) => m.steamId === ctx.senderSteamId);
        }
        catch (e) { }
        if (!me || me.x === undefined || me.y === undefined) {
            return '❌ Cannot find your current position in the game.';
        }
        if (cmd === 'turret-add') {
            const floor = parseInt(ctx.args[1] || '1', 10);
            await client_1.prisma.turretPosition.create({
                data: {
                    x: me.x,
                    y: me.y,
                    floor: isNaN(floor) ? 1 : floor,
                    serverId: ctx.serverId
                }
            });
            return `🔫 Turret position added at your current location [floor ${isNaN(floor) ? 1 : floor}].`;
        }
        if (cmd === 'turret-check') {
            const turrets = await client_1.prisma.turretPosition.findMany({ where: { serverId: ctx.serverId } });
            let count = 0;
            for (const t of turrets) {
                if ((0, grid_1.calculateDistance)(me.x, me.y, t.x, t.y) <= 40) {
                    count++;
                }
            }
            if (count > 12) {
                return `⚠️ WARNING: ${count} turrets in a 40m radius. Interference active!`;
            }
            return `✅ ${count}/12 turrets in a 40m radius. You are safe to add more.`;
        }
        return '';
    }
}
exports.TurretCommand = TurretCommand;
