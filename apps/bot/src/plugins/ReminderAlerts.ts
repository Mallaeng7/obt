import { PluginDefinition } from './PluginAPI';

export const ReminderAlertsPlugin: PluginDefinition = {
  id: 'reminder-alerts',
  name: 'Reminder Alerts',
  description: 'Set a reminder for the team. Usage: !remind [minutes] [message]',
  onLoad: (ctx) => {
    ctx.onEvent('chat:message', async (serverId, msg) => {
      if (serverId !== ctx.serverId) return;
      const parts = msg.message.split(' ');
      if (parts[0] === '!remind' && parts.length >= 3) {
        const mins = parseInt(parts[1], 10);
        if (isNaN(mins)) return;
        
        const reminderText = parts.slice(2).join(' ');
        await ctx.rustplus.sendTeamMessage(`Reminder set for ${mins} minute(s).`);
        
        setTimeout(async () => {
          await ctx.rustplus.sendTeamMessage(`[REMINDER] ${msg.name}: ${reminderText}`);
        }, mins * 60 * 1000);
      }
    });
  },
  onUnload: () => {
    // Implement global timeout cleanup if plugin system unloads
  }
};
