import { create } from 'zustand';

interface AuthState {
  user: any | null;
  token: string | null;
  login: (user: any, token?: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (user, token = null) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));
