import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  // État
  state: () => ({
    items: [],
  }),

  // Actions
  actions: {
    // Ajouter un item au panier
    addItem(item) {
      const existingItem = this.items.find((i) => i.id === item.id && i.sprite === item.sprite);
      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        this.items.push({ ...item, quantity: item.quantity || 1 });
      }
    },
    // Supprimer un item du panier
    removeItem(itemId, sprite) {
      this.items = this.items.filter((item) => !(item.id === itemId && item.sprite === sprite));
    },
    
    // Diminuer la quantité d'un item
    decreaseQuantity(itemId, sprite) {
      const existingItem = this.items.find((i) => i.id === itemId && i.sprite === sprite);
      if (existingItem) {
        existingItem.quantity -= 1;
        if (existingItem.quantity <= 0) {
          this.items = this.items.filter((item) => !(item.id === itemId && item.sprite === sprite));
        }
      }
    },
    
    // Augmenter la quantité d'un item
    increaseQuantity(itemId, sprite) {
      const existingItem = this.items.find((i) => i.id === itemId && i.sprite === sprite);
      if (existingItem) {
        existingItem.quantity += 1;
      }
    },
    
    // Vider le panier
    clearCart() {
      this.items = [];
    },

    // Vérifier si un item est dans le panier
    isInCart(itemId, sprite) {
      return this.items.some((item) => item.id === itemId && item.sprite === sprite);
    }
  },

  // Getters
  getters: {
  totalItems: (state) => 
    state.items.reduce((sum, item) => sum + (item.quantity || 0), 0),
  totalPrice: (state) => 
    state.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0),
},

});
