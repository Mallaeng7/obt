import Link from "next/link";
import { Shield } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 bg-[url('/bg.webp')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-0"></div>
      
      <div className="z-10 flex flex-col items-center max-w-3xl text-center space-y-8 glass-panel p-12 rounded-3xl border border-white/10 shadow-2xl">
        <div className="p-4 bg-primary/20 rounded-full">
          <Shield className="w-16 h-16 text-primary glow-text" />
        </div>
        
        <h1 className="text-5xl font-extrabold tracking-tight">
          Welcome to <span className="text-primary glow-text">RustPlusBot</span>
        </h1>
        
        <p className="text-xl text-muted-foreground">
          The ultimate control center for your Rust servers. Track events, manage smart devices, and monitor your team in real-time.
        </p>
        
        <div className="flex gap-4 pt-4">
          <Link href="/api/auth/signin" className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold transition-all hover:scale-105 shadow-[0_0_15px_rgba(225,29,72,0.5)]">
            Login with Steam
          </Link>
          <Link href="/dashboard" className="px-8 py-4 bg-muted hover:bg-muted/80 text-foreground rounded-full font-semibold transition-all hover:scale-105 border border-white/10">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
