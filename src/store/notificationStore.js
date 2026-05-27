import { create } from "zustand";

export const useNotificationStore = create((set, get) => ({
  notifications: [],

  addNotification: (notif) => {
    const id = Date.now();

    const newNotif = { id, ...notif };

    set((state) => ({
      notifications: [newNotif, ...state.notifications],
    }));

    // ⏱️ Auto remove بعد 3 ثواني
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter(
          (n) => n.id !== id
        ),
      }));
    }, 3000);
  },

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (n) => n.id !== id
      ),
    })),
}));