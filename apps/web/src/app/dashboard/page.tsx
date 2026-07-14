"use client";
import { useEffect, useState } from "react";
import { Server, Users, Target, Clock, Wifi, WifiOff } from "lucide-react";

interface ServerInfo {
  id: string;
  name: string;
  ip: string;
  appPort: number;
  isActive: boolean;
  isConnected?: boolean;
  players?: number;
  maxPlayers?: number;
  queuedPlayers?: number;
}

interface TeamMember {
  id: string;
  name: string;
  isOnline: boolean;
  x?: number;
  y?: number;
}

interface DashboardData {
  servers: ServerInfo[];
  teamMembers: TeamMember[];
  activeDeviceCount: number;
  recentEvents: { type: string; createdAt: string }[];
}

const EVENT_ICONS: Record<string, string> = {
  heli: "🚁",
  cargo: "🚢",
  chinook: "🚁",
  locked_crate: "📦",
  oil_rig_small: "🛢️",
  oil_rig_large: "🛢️",
  deep_sea: "🌊",
};

const EVENT_LABELS: Record<string, string> = {
  heli: "Patrol Helicopter",
  cargo: "Cargo Ship",
  chinook: "Chinook",
  locked_crate: "Locked Crate",
  oil_rig_small: "Small Oil Rig",
  oil_rig_large: "Large Oil Rig",
  deep_sea: "Deep Sea Event",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
}

export default function DashboardOverview() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/dashboard/overview");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Failed to fetch dashboard data:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const firstServer = data?.servers?.[0];
  const totalPlayers = firstServer?.players ?? 0;
  const maxPlayers = firstServer?.maxPlayers ?? 0;
  const queue = firstServer?.queuedPlayers ?? 0;
  const activeDevices = data?.activeDeviceCount ?? 0;
  const onlineMembers = data?.teamMembers?.filter((m) => m.isOnline).length ?? 0;

  const stats = [
    {
      title: "Server Pop",
      value: loading ? "—" : firstServer ? `${totalPlayers} / ${maxPlayers}` : "No Server",
      icon: Users,
      color: "text-blue-500",
      glow: "shadow-[0_0_15px_rgba(59,130,246,0.2)]",
    },
    {
      title: "Queue",
      value: loading ? "—" : String(queue),
      icon: Clock,
      color: "text-orange-500",
      glow: "shadow-[0_0_15px_rgba(249,115,22,0.2)]",
    },
    {
      title: "Active Devices",
      value: loading ? "—" : String(activeDevices),
      icon: Server,
      color: "text-green-500",
      glow: "shadow-[0_0_15px_rgba(34,197,94,0.2)]",
    },
    {
      title: "Team Online",
      value: loading ? "—" : `${onlineMembers} / ${data?.teamMembers?.length ?? 0}`,
      icon: Target,
      color: "text-primary",
      glow: "shadow-[0_0_15px_rgba(225,29,72,0.2)]",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Monitor your Rust servers in real-time.</p>
      </header>

      {/* 서버 연결 없을 때 안내 */}
      {!loading && (!data?.servers || data.servers.length === 0) && (
        <div className="glass-panel p-6 rounded-2xl border border-yellow-500/30 bg-yellow-500/5 text-yellow-400 flex items-center gap-3">
          <WifiOff className="w-5 h-5 shrink-0" />
          <span>
            No servers paired yet. Click "Pair with Server" in-game to connect your Rust server.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`glass-panel p-6 rounded-2xl border border-white/5 flex items-center gap-4 hover:-translate-y-1 transition-transform ${stat.glow}`}
          >
            <div className={`p-4 rounded-full bg-white/5 ${stat.color}`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <h3 className="text-3xl font-bold">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 최근 이벤트 */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5">
          <h3 className="text-xl font-semibold mb-4">Recent Server Events</h3>
          <div className="space-y-4">
            {loading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : data?.recentEvents && data.recentEvents.length > 0 ? (
              data.recentEvents.slice(0, 5).map((e, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{EVENT_ICONS[e.type] ?? "📡"}</span>
                    <span className="font-medium">{EVENT_LABELS[e.type] ?? e.type}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{timeAgo(e.createdAt)}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No recent events.</p>
            )}
          </div>
        </div>

        {/* 팀 상태 */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <h3 className="text-xl font-semibold mb-4">Team Status</h3>
          <div className="space-y-4">
            {loading ? (
              <p className="text-muted-foreground text-sm">Loading...</p>
            ) : data?.teamMembers && data.teamMembers.length > 0 ? (
              data.teamMembers.map((member, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        member.isOnline
                          ? "bg-green-500 shadow-[0_0_8px_#22c55e]"
                          : "bg-zinc-600"
                      }`}
                    />
                    <span className="font-medium">{member.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {member.isOnline ? (
                      <Wifi className="w-4 h-4 text-green-500 inline" />
                    ) : (
                      <WifiOff className="w-4 h-4 text-zinc-500 inline" />
                    )}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No team members tracked.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
