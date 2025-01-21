<script>
import { useCartStore } from '../stores/cartStore';

export default {
  name: 'Cart',
  data() {
    const cartStore = useCartStore();
    return {
      cartStore,
    };
  },
  computed: {
    cartItems() {
      return this.cartStore.items;
    },
    totalItems() {
      return this.cartStore.totalItems;
    },
    totalPrice() {
      return this.cartStore.totalPrice;
    },
  },
  methods: {
    removeFromCart(itemId) {
      this.cartStore.removeItem(itemId);
    },
    clearCart() {
      this.cartStore.clearCart();
    },
  },
};
</script>

<template>
  <div>
    <h1 class="text-black">Panier</h1>
    <div v-if="cartItems.length === 0" class="text-black">Votre panier est vide.</div>
    <ul class="text-black">
      <li v-for="item in cartItems" :key="item.id">
        {{ item.name }} - {{ item.quantity }} x {{ item.price }}€
        <button @click="removeFromCart(item.id)">Supprimer</button>
      </li>
    </ul>
    <div class="text-black" v-if="cartItems.length > 0">
      <p>Total : {{ totalPrice }}€</p>
      <p>Articles : {{ totalItems }}</p>
      <button @click="clearCart">Vider le panier</button>
    </div>
  </div>
</template>
