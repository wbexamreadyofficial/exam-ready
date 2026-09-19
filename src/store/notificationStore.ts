import { create } from 'zustand';

interface NotificationStore {
  /** True while the WebSocket is authenticated and open; otherwise we poll. */
  socketConnected: boolean;
  setSocketConnected: (connected: boolean) => void;
}

export const useNotificationStore = create<NotificationStore>()((set) => ({
  socketConnected: false,
  setSocketConnected: (socketConnected) => set({ socketConnected }),
}));
