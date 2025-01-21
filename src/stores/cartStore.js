import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  // État
  state: () => ({
    items: [],
  }),

  // Actions
  actions: {
    addItem(item) {
      const existingItem = this.items.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        this.items.push({ ...item, quantity: item.quantity || 1 });
      }
    },
    removeItem(itemId) {
      this.items = this.items.filter((item) => item.id !== itemId);
    },
    clearCart() {
      this.items = [];
    },
  },

  // Getters
  getters: {
  totalItems: (state) => 
    state.items.reduce((sum, item) => sum + (item.quantity || 0), 0),
  totalPrice: (state) => 
    state.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0),
},

});
