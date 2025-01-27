<script>
import { RouterLink, RouterView } from "vue-router";
import { ShoppingCartIcon } from '@heroicons/vue/24/solid';
import { useCartStore } from "./stores/cartStore";
import { useNotificationStore } from "./stores/notificationStore";
import Notification from "./components/Notification.vue";
export default {
  name: 'App',
  components: {
    RouterLink,
    RouterView,
    ShoppingCartIcon,
    Notification,
  },
  data() {
    const cartStore = useCartStore();
    const notificationStore = useNotificationStore();
    return {
      cartStore,
      notificationStore,
    };
  },
};
</script>

<template>
  <div class="bg-secondary w-screen h-screen font-pokemon">
    <header class="bg-primary text-white px-8 py-2 shadow-md sticky top-0 z-10">
      <nav class="flex justify-between items-center relative">
        <!-- Pokeapp -->
        <div class="text-3xl font-bold flex items-center space-x-2">
          <img src="/public/assets/pokeball.png" alt="logo Pokeball" class="w-12">
          <RouterLink to="/" class="text-white hover:text-gray-200 hover:bg-transparent">PokeApp</RouterLink>
        </div>

        <!-- Notifications -->
        <div class="flex-1 flex justify-center">
          <div class="absolute top-px left-1/2 transform -translate-x-1/2 top-[1.5em]">
            <div v-for="notification in notificationStore.notifications" :key="notification.id" class="mb-2">
              <Notification :message="notification.message" :type="notification.type" />
            </div>
          </div>
        </div>

        <!-- Mes commandes -->
        <RouterLink to="/orders" class="text-white font-semibold text-lg mr-8 hover:bg-transparent hover:text-gray-200">Mes commandes</RouterLink>

        <!-- Panier -->
        <div class="relative">
          <RouterLink to="/cart" class="hover:bg-transparent">
            <ShoppingCartIcon class="w-9 text-white hover:text-gray-200"></ShoppingCartIcon>
          </RouterLink>
          <span v-if="cartStore.totalItems > 0"
            class="absolute top-2 left-7 bg-red-400 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {{ cartStore.totalItems }}
          </span>
        </div>
      </nav>
    </header>

    <RouterView />
  </div>
</template>


