import { createRouter, createWebHistory } from "vue-router";
import Pokemons from "@/components/Pokemons.vue";
import PokemonDetails from "@/components/PokeDetails.vue";
import Cart from "@/components/Cart.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Pokemons,
    },
    {
      path: "/pokemon/:id",
      name: "PokeDetails",
      component: PokemonDetails,
      props: true,
    },
    {
      path: "/cart",
      name: "Cart",
      component: Cart,
    }
  ],
});

export default router;
