<script>
import { useCartStore } from '../stores/cartStore';
import CartCell from './CartCell.vue';
import utilsMixin from '../mixins/utilsMixin';

export default {
  name: 'Cart',
  mixins: [utilsMixin],
  components: {
    CartCell,
  },
  data() {
    const cartStore = useCartStore();
    return {
      cartStore,
    };
  },
  computed: {
    // Récupère les articles du panier
    cartItems() {
      return this.cartStore.items;
    },
    // Récupère le nombre total d'articles
    totalItems() {
      return this.cartStore.totalItems;
    },
    // Récupère le prix total
    totalPrice() {
      return this.cartStore.totalPrice;
    },
  },
  methods: {
    // Supprime un item du panier
    removeFromCart(itemId) {
      this.cartStore.removeItem(itemId);
    },
    // Diminue la quantité d'un item
    decreaseItemQuantity(itemId) {
      this.cartStore.decreaseQuantity(itemId);
    },
    // Augmente la quantité d'un item
    increaseItemQuantity(itemId) {
      this.cartStore.increaseQuantity(itemId);
    },
    // Vide le panier
    clearCart() {
      this.cartStore.clearCart();
    },
  },
};
</script>

<template>
  <div class="bg-gray-100 min-h-screen p-6">
    <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">🛒 Votre Panier</h1>

    <!-- Si le panier est vide -->
    <div v-if="cartItems.length === 0" class="text-center text-gray-600 mt-10">
      <p class="text-xl">Votre panier est vide.</p>
    </div>

    <!-- Si le panier contient des items -->
    <div v-else class="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <!-- Liste des items -->
      <ul class="space-y-6">
        <li v-for="item in cartItems" :key="item.id">
          <CartCell :item="item" @decrease="decreaseItemQuantity(item.id)" @increase="increaseItemQuantity(item.id)"
            @remove="removeFromCart(item.id)" />
        </li>
      </ul>

      <!-- Résumé du panier -->
      <div class="mt-8 pt-6">
        <div class="flex justify-between text-lg">
          <span class="font-semibold text-gray-700">Nombre d'articles :</span>
          <span class="text-gray-700">{{ totalItems }}</span>
        </div>
        <div class="flex justify-between text-lg mt-2">
          <span class="font-semibold text-gray-700">Total :</span>
          <span class="text-gray-700 font-bold">{{ convertPrice(totalPrice) }}</span>
        </div>

        <!-- Bouton pour vider le panier -->
        <div class="mt-8 text-center">
          <button @click="clearCart" class="bg-red-500 text-white px-6 py-3 rounded-full shadow hover:bg-red-600">
            Vider le panier
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
