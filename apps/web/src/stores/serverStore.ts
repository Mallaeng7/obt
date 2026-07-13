import { create } from 'zustand';

interface ServerState {
  activeServerId: string | null;
  servers: any[];
  setActiveServer: (id: string) => void;
  setServers: (servers: any[]) => void;
}

export const useServerStore = create<ServerState>((set) => ({
  activeServerId: null,
  servers: [],
  setActiveServer: (id) => set({ activeServerId: id }),
  setServers: (servers) => set({ servers }),
}));
