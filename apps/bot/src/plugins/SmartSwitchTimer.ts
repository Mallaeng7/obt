import { PluginDefinition } from './PluginAPI';

export const SmartSwitchTimerPlugin: PluginDefinition = {
  id: 'smart-switch-timer',
  name: 'Smart Switch Timer',
  description: 'Turns on a switch and automatically turns it off after X minutes. Usage: !timer [entityId] [minutes]',
  onLoad: (ctx) => {
    ctx.onEvent('chat:message', async (serverId, msg) => {
      if (serverId !== ctx.serverId) return;
      const parts = msg.message.split(' ');
      if (parts[0] === '!timer' && parts.length >= 3) {
        const entityId = parseInt(parts[1], 10);
        const mins = parseInt(parts[2], 10);
        if (isNaN(entityId) || isNaN(mins)) return;
        
        await ctx.rustplus.turnOnSmartSwitch(entityId);
        await ctx.rustplus.sendTeamMessage(`Switch ${entityId} turned ON for ${mins} minute(s).`);
        
        setTimeout(async () => {
          await ctx.rustplus.turnOffSmartSwitch(entityId);
          await ctx.rustplus.sendTeamMessage(`Switch ${entityId} timer ended. Turned OFF.`);
        }, mins * 60 * 1000);
      }
    });
  },
  onUnload: () => {
    // Implement global timeout cleanup if plugin system unloads
  }
};
