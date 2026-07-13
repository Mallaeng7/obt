import { commandRouter } from './CommandRouter';
import { PopCommand } from './PopCommand';
import { NightCommand } from './NightCommand';
import { EventsCommand } from './EventsCommand';
import { StatusCommand } from './StatusCommand';
import { OnOffCommand } from './OnOffCommand';
import { CraftCommand } from './CraftCommand';
import { RecycleCommand } from './RecycleCommand';
import { DurabilityCommand } from './DurabilityCommand';
import { DecayCommand } from './DecayCommand';
import { VendCommand } from './VendCommand';
import { WatchForCommand } from './WatchForCommand';
import { PromoteCommand } from './PromoteCommand';
import { DeathCommand } from './DeathCommand';
import { TeamStatsCommand } from './TeamStatsCommand';
import { TurretCommand } from './TurretCommand';

export function registerCommands() {
  commandRouter.register(new PopCommand());
  commandRouter.register(new NightCommand());
  commandRouter.register(new EventsCommand());
  commandRouter.register(new StatusCommand());
  commandRouter.register(new OnOffCommand());
  commandRouter.register(new CraftCommand());
  commandRouter.register(new RecycleCommand());
  commandRouter.register(new DurabilityCommand());
  commandRouter.register(new DecayCommand());
  commandRouter.register(new VendCommand());
  commandRouter.register(new WatchForCommand());
  commandRouter.register(new PromoteCommand());
  commandRouter.register(new DeathCommand());
  commandRouter.register(new TeamStatsCommand());
  commandRouter.register(new TurretCommand());
}
