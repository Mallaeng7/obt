"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, MonitorSmartphone, Users, Settings, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Live Map", href: "/dashboard/map", icon: Map },
  { name: "Devices", href: "/dashboard/devices", icon: MonitorSmartphone },
  { name: "Team & Stats", href: "/dashboard/team", icon: Users },
  { name: "Events", href: "/dashboard/events", icon: Activity },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 glass-panel border-r border-white/5 flex flex-col h-full sticky top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold tracking-tighter text-primary glow-text">RustPlusBot</h2>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-primary/20 text-primary glow-text border border-primary/30 shadow-[0_0_10px_rgba(225,29,72,0.2)]" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="font-bold text-primary">S</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold">SteamUser</span>
            <span className="text-xs text-green-500">Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
