import { createRouter, createWebHistory } from "vue-router";
import Pokemons from "@/components/Pokemons.vue";
import PokemonDetails from "@/components/PokeDetails.vue";
import Cart from "@/components/Cart.vue";
import ConfirmCart from "@/components/ConfirmCart.vue";
import Orders from "@/components/Orders.vue";

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
    },
    {
      path: "/confirmation",
      name: "ConfirmCart",
      component: ConfirmCart,
    },
    {
      path: "/orders",
      name: "Orders",
      component: Orders,
    }
  ],
});

export default router;
