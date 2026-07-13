"use client";
import { Users, Crosshair, Clock, AlertTriangle } from "lucide-react";

export default function TeamPage() {
  const team = [
    { name: "SteamUser", role: "Leader", status: "Online", playtime: "42h 15m", deaths: 12, afk: "5m", map: "I14" },
    { name: "RustChad", role: "Member", status: "Online", playtime: "120h 3m", deaths: 4, afk: "0m", map: "Oil Rig" },
    { name: "FarmerJoe", role: "Member", status: "Offline", playtime: "8h 45m", deaths: 22, afk: "-", map: "Base" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <Users className="w-10 h-10 text-primary glow-text" /> Team & Stats
        </h1>
        <p className="text-muted-foreground mt-2">Monitor team members' playtime, status, and stats.</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {team.map((member, i) => (
          <div key={i} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/5 transition-colors">
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 text-xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${member.status === 'Online' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-zinc-600'}`}></div>
              </div>
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {member.name} 
                  {member.role === 'Leader' && <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-500 border border-yellow-500/50">Leader</span>}
                </h3>
                <p className="text-sm text-muted-foreground">Status: {member.status} • Location: {member.map}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 md:gap-8">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-muted-foreground">Playtime</p>
                  <p className="font-semibold">{member.playtime}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Crosshair className="w-5 h-5 text-red-400" />
                <div>
                  <p className="text-xs text-muted-foreground">Deaths</p>
                  <p className="font-semibold">{member.deaths}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-xs text-muted-foreground">AFK Time</p>
                  <p className="font-semibold">{member.afk}</p>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
