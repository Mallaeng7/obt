"use client";
import { Package, Search } from "lucide-react";

export default function VendingPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <Package className="w-10 h-10 text-primary glow-text" /> Vending Monitors
          </h1>
          <p className="text-muted-foreground mt-2">Track specific items across all map vending machines.</p>
        </div>
      </header>

      <div className="glass-panel p-8 rounded-3xl border border-white/5 text-center">
        <h2 className="text-2xl font-bold mb-4">Vending Monitoring System</h2>
        <p className="text-muted-foreground mb-6">Search for items (e.g. "LR-300", "Scrap") and set up alerts when they are restocked.</p>
        
        <div className="flex justify-center">
           <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input type="text" placeholder="Enter item name..." className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-primary/50 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}
