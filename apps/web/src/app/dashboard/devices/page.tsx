"use client";
import { useState, useEffect } from "react";
import { MonitorSmartphone, Power, ShieldAlert, Package } from "lucide-react";
import { cn } from "@/lib/utils";

import { fetchAPI } from "@/lib/api";
import { useServerStore } from "@/stores/serverStore";

export default function DevicesPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const activeServerId = useServerStore(state => state.activeServerId);

  useEffect(() => {
    if (!activeServerId) return;
    fetchAPI(`/servers/${activeServerId}/devices`).then(setDevices).catch(console.error);
  }, [activeServerId]);

  const toggleDevice = async (id: number, entityId: number, isOn: boolean) => {
    if (!activeServerId) return;
    try {
      await fetchAPI(`/servers/${activeServerId}/devices/${entityId}/toggle`, {
        method: 'POST',
        body: JSON.stringify({ value: !isOn })
      });
      setDevices(devices.map(d => 
        d.id === id && d.type === "switch" ? { ...d, isActive: !d.isActive } : d
      ));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <MonitorSmartphone className="w-10 h-10 text-primary glow-text" /> Smart Devices
          </h1>
          <p className="text-muted-foreground mt-2">Manage your Rust+ paired switches, alarms, and monitors remotely.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {devices.map((device) => (
          <div key={device.id} className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
            <div className={cn(
              "absolute -right-12 -top-12 w-32 h-32 rounded-full opacity-20 blur-2xl transition-colors",
              device.isActive ? "bg-green-500" : (device.type === "alarm" ? "bg-red-500" : "bg-primary")
            )}></div>
            
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl">
                  {device.type === "switch" && <Power className={cn("w-6 h-6", device.isActive ? "text-green-500" : "text-muted-foreground")} />}
                  {device.type === "alarm" && <ShieldAlert className="w-6 h-6 text-red-500" />}
                  {device.type === "storage_monitor" && <Package className="w-6 h-6 text-blue-500" />}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{device.name}</h3>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">{device.type.replace('_', ' ')}</p>
                </div>
              </div>

              {device.type === "switch" && (
                <button 
                  onClick={() => toggleDevice(device.id, device.entityId, device.isActive)}
                  className={cn(
                    "w-14 h-8 rounded-full flex items-center p-1 cursor-pointer transition-colors shadow-inner",
                    device.isActive ? "bg-green-500 justify-end shadow-[0_0_10px_rgba(34,197,94,0.5)]" : "bg-zinc-700 justify-start"
                  )}
                >
                  <div className="w-6 h-6 bg-white rounded-full shadow-md"></div>
                </button>
              )}
            </div>

            {device.type === "storage_monitor" && (
              <div className="mt-6 relative z-10">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-bold">{device.capacity} / {device.maxCapacity} slots</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" 
                    style={{ width: `${(device.capacity! / device.maxCapacity!) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
            
            {device.type === "alarm" && (
              <div className="mt-6 relative z-10">
                <button className="w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 border border-red-500/50 rounded-lg transition-colors font-medium">
                  Test Alarm Alert
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
