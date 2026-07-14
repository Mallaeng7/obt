"use client";
import { useEffect, useState } from "react";
import { Users, Crosshair, Clock, AlertTriangle, WifiOff } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  steamId: string;
  isOnline: boolean;
  isAlive: boolean;
  deathCount: number;
  playTime: number;  // 분 단위
  afkTime: number;   // 분 단위
  x?: number;
  y?: number;
}

function formatMinutes(mins: number): string {
  if (!mins) return "0m";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverId, setServerId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // 먼저 첫 번째 서버 ID 조회
        const serversRes = await fetch("/api/servers");
        if (!serversRes.ok) throw new Error("No servers");
        const servers = await serversRes.json();
        if (!servers || servers.length === 0) { setLoading(false); return; }

        const sid = servers[0].id;
        setServerId(sid);

        const res = await fetch(`/api/servers/${sid}/team`);
        if (!res.ok) throw new Error("Failed to fetch team");
        const data = await res.json();
        setMembers(data);
      } catch {
        // 서버 없거나 에러
      } finally {
        setLoading(false);
      }
    }
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <Users className="w-10 h-10 text-primary glow-text" /> Team &amp; Stats
        </h1>
        <p className="text-muted-foreground mt-2">Monitor team members' playtime, status, and stats.</p>
      </header>

      {loading ? (
        <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center text-muted-foreground">
          Loading team data...
        </div>
      ) : !serverId ? (
        <div className="glass-panel p-8 rounded-2xl border border-yellow-500/20 bg-yellow-500/5 flex items-center gap-3 text-yellow-400">
          <WifiOff className="w-5 h-5 shrink-0" />
          <span>
            No server connected. Use the <code className="bg-white/10 px-1 rounded">/pair</code> Discord command to connect your Rust server.
          </span>
        </div>
      ) : members.length === 0 ? (
        <div className="glass-panel p-8 rounded-2xl border border-white/5 text-center text-muted-foreground">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No team members found.</p>
          <p className="text-sm mt-1 opacity-60">Team data is synced when the bot is connected to a Rust server.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 text-xl font-bold">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div
                    className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background ${
                      member.isOnline ? "bg-green-500 shadow-[0_0_8px_#22c55e]" : "bg-zinc-600"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    {member.name}
                    {!member.isAlive && (
                      <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30">💀 Dead</span>
                    )}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {member.isOnline ? "🟢 Online" : "⚫ Offline"}
                    {member.x != null && member.y != null && ` • (${Math.round(member.x)}, ${Math.round(member.y)})`}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 md:gap-8">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-muted-foreground">Playtime</p>
                    <p className="font-semibold">{formatMinutes(member.playTime)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Crosshair className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-xs text-muted-foreground">Deaths</p>
                    <p className="font-semibold">{member.deathCount}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  <div>
                    <p className="text-xs text-muted-foreground">AFK Time</p>
                    <p className="font-semibold">{member.afkTime ? formatMinutes(member.afkTime) : "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
