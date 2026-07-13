import { events } from '../../core/EventEmitterHub';
import { rustPlusManager } from '../../core/RustPlusManager';
import { commandRouter, CommandContext } from '../commands/CommandRouter';

export class TeamChatHandler {
  constructor() {
    events.on('team:chat', async (serverId, msg) => {
      // Ignore messages from the bot itself
      if (msg.name === 'RustPlusBot') return; // Or whatever name the bot uses

      if (msg.message.startsWith('!')) {
        const args = msg.message.substring(1).trim().split(/\s+/);
        const serverInstance = rustPlusManager.getServer(serverId);
        
        if (!serverInstance) return;

        const ctx: CommandContext = {
          serverId,
          senderSteamId: msg.steamId,
          senderName: msg.name,
          args,
          rustplus: serverInstance.client
        };

        const response = await commandRouter.dispatch(ctx);
        if (response) {
          await serverInstance.client.sendTeamMessage(response);
        }
      }
    });
  }
}

export const teamChatHandler = new TeamChatHandler();
