"use client";
import { useEffect, useState } from "react";
import { Settings, Server, Key, Bell, Wifi, WifiOff, Loader2 } from "lucide-react";

interface ServerInfo {
  id: string;
  name: string;
  ip: string;
  appPort: number;
  isActive: boolean;
}

export default function SettingsPage() {
  const [servers, setServers] = useState<ServerInfo[]>([]);
  const [pendingPairings, setPendingPairings] = useState<any[]>([]);
  const [loadingServers, setLoadingServers] = useState(true);
  const [alertChannelId, setAlertChannelId] = useState("");
  const [savingChannel, setSavingChannel] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    async function loadServers() {
      try {
        const [res, pendingRes] = await Promise.all([
          fetch("/api/servers"),
          fetch("/api/servers/pending")
        ]);
        if (res.ok) setServers(await res.json());
        if (pendingRes.ok) setPendingPairings(await pendingRes.json());
      } catch { /* ignore */ }
      finally { setLoadingServers(false); }
    }
    loadServers();
    const iv = setInterval(loadServers, 10000); // 10초마다 갱신
    return () => clearInterval(iv);
  }, []);

  async function handleConnectPending(pending: any) {
    try {
      const res = await fetch("/api/servers/pair", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pending),
      });
      if (res.ok) {
        const newServer = await res.json();
        setServers((prev) => [...prev, newServer]);
        setPendingPairings((prev) => prev.filter((p) => p.ip !== pending.ip || p.port !== pending.port));
      } else {
        alert("Failed to connect server.");
      }
    } catch {
      alert("Error connecting server.");
    }
  }

  async function handleDisconnect(id: string) {
    try {
      await fetch(`/api/servers/${id}`, { method: "DELETE" });
      setServers((prev) => prev.filter((s) => s.id !== id));
    } catch {
      alert("Failed to disconnect server.");
    }
  }

  async function handleSaveChannel() {
    if (!servers[0]) return;
    setSavingChannel(true);
    setSaveMsg("");
    try {
      const res = await fetch(`/api/servers/${servers[0].id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertChannelId }),
      });
      if (res.ok) setSaveMsg("✅ Saved!");
      else setSaveMsg("❌ Failed to save.");
    } catch {
      setSaveMsg("❌ Error.");
    } finally {
      setSavingChannel(false);
    }
  }

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
              <input
                type="password"
                value="********************************"
                readOnly
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none opacity-50 cursor-not-allowed"
              />
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
              <input
                type="password"
                value="********************************"
                readOnly
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none opacity-50 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Alert Channel ID</label>
              <input
                type="text"
                value={alertChannelId}
                onChange={(e) => setAlertChannelId(e.target.value)}
                placeholder="e.g. 1526295100077113526"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            {saveMsg && <p className="text-sm">{saveMsg}</p>}
            <button
              onClick={handleSaveChannel}
              disabled={savingChannel || servers.length === 0}
              className="w-full py-3 bg-primary hover:bg-primary/90 disabled:opacity-40 text-white rounded-xl font-medium transition-colors shadow-[0_0_15px_rgba(225,29,72,0.5)] flex items-center justify-center gap-2"
            >
              {savingChannel && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
          </div>
        </section>

        {/* Paired Servers */}
        <section className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6 lg:col-span-2">
          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <div className="p-3 bg-white/5 rounded-xl"><Server className="w-6 h-6 text-green-400" /></div>
            <h2 className="text-2xl font-bold">Paired Rust Servers</h2>
          </div>

          {loadingServers ? (
            <div className="flex items-center gap-3 text-muted-foreground py-4">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading servers...
            </div>
          ) : servers.length === 0 ? (
            <div className="flex items-center gap-3 p-5 rounded-xl bg-white/3 border border-white/10 text-muted-foreground">
              <WifiOff className="w-5 h-5 shrink-0 text-yellow-500" />
              <div>
                <p className="font-medium text-foreground">No servers paired</p>
                <p className="text-sm mt-0.5">
                  Use the <code className="bg-white/10 px-1 rounded">/credentials add</code> Discord command first, then click "Pair with Server" in-game to connect a Rust server.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {servers.map((server) => (
                <div
                  key={server.id}
                  className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <Wifi className="w-5 h-5 text-green-400 shrink-0" />
                    <div>
                      <h3 className="font-bold text-lg">{server.name}</h3>
                      <p className="text-sm text-muted-foreground">{server.ip}:{server.appPort}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 bg-green-500/20 text-green-500 border border-green-500/30 rounded-lg text-sm font-medium">
                      Connected
                    </span>
                    <button
                      onClick={() => handleDisconnect(server.id)}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded-lg transition-colors border border-red-500/50"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pending Pairings */}
          <div className="pt-4 mt-4 border-t border-white/5">
            <h3 className="text-lg font-semibold mb-3">Pending Pairing Requests</h3>
            {loadingServers ? (
              <p className="text-sm text-muted-foreground">Loading pending requests...</p>
            ) : pendingPairings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No pending pairing requests. Click "Pair with Server" in-game to see them here.</p>
            ) : (
              <div className="space-y-3">
                {pendingPairings.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Server className="w-5 h-5 text-yellow-400 shrink-0" />
                      <div>
                        <h4 className="font-bold">{p.serverName}</h4>
                        <p className="text-xs text-muted-foreground">{p.ip}:{p.port}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleConnectPending(p)}
                      className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors border border-green-500/50 font-medium"
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
