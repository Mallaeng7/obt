"use client";
import { Server, Users, Target, Clock } from "lucide-react";

export default function DashboardOverview() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Monitor your Rust servers in real-time.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Server Pop", value: "128 / 250", icon: Users, color: "text-blue-500", glow: "shadow-[0_0_15px_rgba(59,130,246,0.2)]" },
          { title: "Queue", value: "42", icon: Clock, color: "text-orange-500", glow: "shadow-[0_0_15px_rgba(249,115,22,0.2)]" },
          { title: "Active Devices", value: "14", icon: Server, color: "text-green-500", glow: "shadow-[0_0_15px_rgba(34,197,94,0.2)]" },
          { title: "Turrets Paired", value: "8 / 12", icon: Target, color: "text-primary", glow: "shadow-[0_0_15px_rgba(225,29,72,0.2)]" },
        ].map((stat, i) => (
          <div key={i} className={`glass-panel p-6 rounded-2xl border border-white/5 flex items-center gap-4 hover:-translate-y-1 transition-transform ${stat.glow}`}>
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
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-white/5">
          <h3 className="text-xl font-semibold mb-4">Recent Server Events</h3>
          <div className="space-y-4">
            {[
              { event: "Cargo Ship", time: "5 mins ago", icon: "🚢", type: "blue" },
              { event: "Patrol Helicopter", time: "15 mins ago", icon: "🚁", type: "red" },
              { event: "Locked Crate", time: "42 mins ago", icon: "📦", type: "yellow" },
            ].map((e, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{e.icon}</span>
                  <span className="font-medium">{e.event}</span>
                </div>
                <span className="text-sm text-muted-foreground">{e.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <h3 className="text-xl font-semibold mb-4">Team Status</h3>
          <div className="space-y-4">
            {[
              { name: "SteamUser", status: "Online", map: "I14" },
              { name: "RustChad", status: "Online", map: "Oil Rig" },
              { name: "FarmerJoe", status: "Offline", map: "Base" },
            ].map((member, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${member.status === 'Online' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-zinc-600'}`}></div>
                  <span className="font-medium">{member.name}</span>
                </div>
                <span className="text-sm text-muted-foreground">{member.map}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
