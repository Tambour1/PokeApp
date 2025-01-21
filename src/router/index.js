import { createRouter, createWebHistory } from "vue-router";
import Pokemons from "@/components/Pokemons.vue";
import SearchPokemon from "@/components/SearchPokemon.vue";
import PokemonDetails from "@/components/PokeDetails.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Pokemons,
    },
    {
      path: "/pokemon",
      name: "pokemon",
      component : SearchPokemon 
    },
    {
      path: "/pokemon/:id",
      name: "PokeDetails",
      component: PokemonDetails,
      props: true,
    }
  ],
});

export default router;
