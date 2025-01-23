<script>
import { useCartStore } from '../stores/cartStore';
import CartCell from './CartCell.vue';
import utilsMixin from '../mixins/utilsMixin';
import cartPokemonMixin from '../mixins/cartPokemonMixin';
import { RouterLink } from 'vue-router';

export default {
  name: 'Cart',
  mixins: [utilsMixin, cartPokemonMixin],
  components: {
    CartCell,
    RouterLink,
  },
  data() {
    const cartStore = useCartStore();
    return {
      cartStore,
    };
  },
  methods: {
    // Supprime un item du panier en fonction de l'ID et du sprite
    removeFromCart(itemId, sprite) {
      this.cartStore.removeItem(itemId, sprite);
    },
    // Diminue la quantité d'un item en fonction de l'ID et du sprite
    decreaseItemQuantity(itemId, sprite) {
      this.cartStore.decreaseQuantity(itemId, sprite);
    },
    // Augmente la quantité d'un item en fonction de l'ID et du sprite
    increaseItemQuantity(itemId, sprite) {
      this.cartStore.increaseQuantity(itemId, sprite);
    },
    // Vide le panier
    clearCart() {
      this.cartStore.clearCart();
    },
  },
};
</script>

<template>
  <div class="bg-secondary min-h-screen p-6">
    <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">🛒 Votre Panier</h1>

    <!-- Si le panier est vide -->
    <div v-if="pokemonsInCart.length === 0" class="text-center text-gray-600 mt-10">
      <p class="text-xl">Votre panier est vide.</p>
    </div>

    <!-- Si le panier contient des pokemons -->
    <div v-else class="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <!-- Liste des pokemons -->
      <ul class="space-y-6">
        <li v-for="pokemon in pokemonsInCart" :key="pokemon.id">
          <CartCell :item="pokemon" @decrease="decreaseItemQuantity(pokemon.id,pokemon.sprite)" @increase="increaseItemQuantity(pokemon.id, pokemon.sprite)"
            @remove="removeFromCart(pokemon.id, pokemon.sprite)" />
        </li>
      </ul>

      <!-- Résumé du panier -->
      <div class="mt-8 pt-6">
        <div class="flex justify-between text-lg">
          <span class="font-semibold text-gray-700">Nombre de Pokémons :</span>
          <span class="text-gray-700">{{ totalPokemonsInCart }}</span>
        </div>
        <div class="flex justify-between text-lg mt-2">
          <span class="font-semibold text-gray-700">Total :</span>
          <span class="text-gray-700 font-bold">{{ convertPrice(totalPricePokemonsInCart) }}</span>
        </div>

        <!-- Bouton pour vider le panier -->
        <div class=" flex justify-around mt-12 text-center">
          <button @click="clearCart" class="bg-red-500 text-white px-6 py-3 rounded-full shadow hover:bg-red-600">
            Vider le panier
          </button>  
          <RouterLink to="/confirmation" class="bg-green-500 text-white px-6 py-3 rounded-full shadow hover:bg-green-600">Valider le panier</RouterLink>        
        </div>
      </div>
    </div>
  </div>
</template>
