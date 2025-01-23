import { defineStore } from 'pinia';

export const useOrderStore = defineStore('order', {
  state: () => ({
    orders: [],
  }),
  actions: {
    // Ajouter une commande
    addOrder(order) {
      this.orders.push(order);
    },
    // Récupérer toutes les commandes
    getOrders() {
      return this.orders;
    },
  },
});
