import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    notifications: [],
  }),

  actions: {
    // Ajout d'une notification
    addNotification(message) {
      const id = Date.now();
      this.notifications.push({ id, message });

      setTimeout(() => {
        this.removeNotification(id);
      }, 3000);
    },
    // Suppression d'une notification
    removeNotification(id) {
      this.notifications = this.notifications.filter((notif) => notif.id !== id);
    },
  },
});
