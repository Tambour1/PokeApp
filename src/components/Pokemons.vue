<script>
import { getPokemons } from "../../services/httpClient";
import PokeCard from "./PokeCard.vue";
export default {
  name: "Pokemons",
  components: {
    PokeCard,
  },
  data() {
    return {
      pokemons: [],
      loading : true,
      error: null,
    };
  },
  methods: {
    async fetchPokemons() {
      try {
        const pokemonList = await getPokemons(5);
        const promises = pokemonList.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
        this.pokemons = await Promise.all(promises);
        this.loading = false;
      } catch (error) {
        this.error = "Impossible de récupérer la liste des Pokémons.";
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchPokemons();
  },
};
</script>

<template>
    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center h-screen">
      <div class="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p class="text-gray-500 text-xl font-bold">Chargement...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center h-screen">
      <p class="text-red-500 text-xl font-bold">{{ error }}</p>
    </div>

    <!-- Pokemons -->
    <ul v-else class="flex flex-wrap justify-center bg-gray-100 gap-4 p-4">
      <li v-for="pokemon in pokemons" :key="pokemon.id">
        <PokeCard :pokemon="pokemon" />
      </li>
    </ul>
</template>

