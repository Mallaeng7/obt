"use client";
import { Settings, Server, Key, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <Settings className="w-10 h-10 text-primary glow-text" /> Settings
        </h1>
        <p className="text-muted-foreground mt-2">Manage your bot credentials and server configurations.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Steam Config */}
        <section className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <div className="p-3 bg-white/5 rounded-xl"><Key className="w-6 h-6 text-blue-400" /></div>
            <h2 className="text-2xl font-bold">Steam API Credentials</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Steam Web API Key</label>
              <input type="password" value="********************************" readOnly className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none opacity-50 cursor-not-allowed" />
            </div>
            <p className="text-sm text-muted-foreground">Configured via environment variables (.env).</p>
          </div>
        </section>

        {/* Discord Config */}
        <section className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <div className="p-3 bg-white/5 rounded-xl"><Bell className="w-6 h-6 text-indigo-400" /></div>
            <h2 className="text-2xl font-bold">Discord Integration</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Bot Token</label>
              <input type="password" value="********************************" readOnly className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none opacity-50 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Alert Channel ID</label>
              <input type="text" placeholder="e.g. 1526295100077113526" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors" />
            </div>
            <button className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors shadow-[0_0_15px_rgba(225,29,72,0.5)]">
              Save Changes
            </button>
          </div>
        </section>

        {/* Server Config */}
        <section className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6 lg:col-span-2">
          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <div className="p-3 bg-white/5 rounded-xl"><Server className="w-6 h-6 text-green-400" /></div>
            <h2 className="text-2xl font-bold">Paired Rust Servers</h2>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
            <div>
              <h3 className="font-bold text-lg">Main Vanilla [US]</h3>
              <p className="text-sm text-muted-foreground">IP: 192.168.1.1:28082</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-green-500/20 text-green-500 border border-green-500/30 rounded-lg text-sm font-medium">Connected</span>
              <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors border border-red-500/50">Disconnect</button>
            </div>
          </div>
          
          <button className="w-full py-4 border-2 border-dashed border-white/20 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-white transition-colors hover:border-white/40 font-medium">
            + Pair New Server
          </button>
        </section>

      </div>
    </div>
  );
}
