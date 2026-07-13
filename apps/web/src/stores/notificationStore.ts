import { create } from 'zustand';

interface NotificationState {
  notifications: any[];
  addNotification: (notification: any) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notif) => set((state) => ({ notifications: [...state.notifications, notif] })),
  clearNotifications: () => set({ notifications: [] }),
}));
