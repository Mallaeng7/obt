import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[url('/bg.webp')] bg-cover bg-center">
      <div className="absolute inset-0 bg-background/90 z-0"></div>
      
      <div className="z-10 flex w-full h-full">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          {children}
        </main>
      </div>
    </div>
  );
}
