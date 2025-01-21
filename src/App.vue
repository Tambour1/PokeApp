<script>
import { RouterLink, RouterView } from "vue-router";
import { ShoppingCartIcon } from '@heroicons/vue/24/solid';
import { useCartStore } from "./stores/cartStore";
export default {
  name: 'App',
  components: {
    RouterLink,
    RouterView,
    ShoppingCartIcon,
  },
  data() {
    const cartStore = useCartStore();
    return {
      cartStore,
    };
  },
};
</script>

<template>
  <div class="bg-secondary w-screen h-screen font-pokemon">
    <header class="bg-primary text-white px-8 py-2 shadow-md sticky top-0 z-10">
      <nav class="flex justify-between items-center">
        <!-- Pokeapp -->
        <div class="text-3xl font-bold">
          <RouterLink to="/" class="text-white hover:text-gray-200 hover:bg-transparent">PokeAPP</RouterLink>
        </div>

        <!-- Menu de navigation -->
        <div class="flex space-x-10 justify-between items-center">
          <RouterLink 
            to="/" 
            class="text-white text-lg font-semibold hover:text-gray-200 hover:bg-transparent"
          >
            Pokémons
          </RouterLink>
          <RouterLink 
            to="/pokemon" 
            class="text-white text-lg font-semibold hover:text-gray-200 hover:bg-transparent"
          >
            Trouver un Pokémon
          </RouterLink>
          <div class="relative">
            <RouterLink to="/cart" class=" hover:bg-transparent ">
              <ShoppingCartIcon class="w-9 text-white hover:text-gray-200"></ShoppingCartIcon>
            </RouterLink>
            <span 
              v-if="cartStore.totalItems > 0" 
              class="absolute top-2 left-7 bg-red-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ cartStore.totalItems }}
            </span>
          </div>
        </div>
      </nav>
    </header>
    <RouterView />
  </div>
</template>

