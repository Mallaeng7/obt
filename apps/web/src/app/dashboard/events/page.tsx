"use client";
import { Activity, Search, Filter } from "lucide-react";

import { fetchAPI } from "@/lib/api";
import { useServerStore } from "@/stores/serverStore";
import { useState, useEffect } from "react";

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const activeServerId = useServerStore(state => state.activeServerId);

  useEffect(() => {
    if (!activeServerId) return;
    fetchAPI(`/servers/${activeServerId}/events`).then(setEvents).catch(console.error);
  }, [activeServerId]);
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <Activity className="w-10 h-10 text-primary glow-text" /> Event History
          </h1>
          <p className="text-muted-foreground mt-2">Log of all major server events and their spawn locations.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input type="text" placeholder="Search events..." className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 transition-colors" />
          </div>
          <button className="glass-panel p-2 rounded-xl flex items-center gap-2 px-4 hover:bg-white/10 transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </header>

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="px-6 py-4 font-medium text-muted-foreground">Event Type</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Time</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Coordinates</th>
              <th className="px-6 py-4 font-medium text-muted-foreground text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {events.map((event) => (
              <tr key={event.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3 font-semibold">
                  {event.type === 'heli' && <span className="text-2xl drop-shadow-[0_0_5px_red]">🚁</span>}
                  {event.type === 'cargo' && <span className="text-2xl drop-shadow-[0_0_5px_blue]">🚢</span>}
                  {event.type === 'locked_crate' && <span className="text-2xl drop-shadow-[0_0_5px_yellow]">📦</span>}
                  {event.type.includes('oil_rig') && <span className="text-2xl drop-shadow-[0_0_5px_green]">🛢️</span>}
                  {event.type}
                </td>
                <td className="px-6 py-4 text-muted-foreground">{new Date(event.createdAt).toLocaleString()}</td>
                <td className="px-6 py-4 font-mono text-sm">[X: {event.x}, Y: {event.y}]</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-primary hover:text-primary/80 font-medium">Show on Map</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
