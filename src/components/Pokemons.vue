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
      currentPage: 1,
      pageSize: 12,
      total: 0,
    };
  },
  methods: {
    async fetchPokemons() {
      try {
        this.loading = true;
        const offset = (this.currentPage - 1) * this.pageSize;
        const pokemonList = await getPokemons(this.pageSize, offset);
        
        this.totalPokemons = pokemonList.count;

        const promises = pokemonList.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
        this.pokemons = await Promise.all(promises);
      } catch (error) {
        this.error = "Impossible de récupérer la liste des Pokémons.";
      } finally {
        this.loading = false;
      }
    },
    changePage(newPage) {
      this.currentPage = newPage;
      this.fetchPokemons();
    },
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
  <div v-else>
    <ul class="flex flex-wrap justify-center bg-secondary gap-4 p-4">
      <li v-for="pokemon in pokemons" :key="pokemon.id">
        <PokeCard :pokemon="pokemon" />
      </li>
    </ul>

    <!-- Pagination -->
    <div class="flex justify-center mt-4">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-4 py-2 mx-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Précédent
      </button>
      <span class="text-gray-900 px-4 py-2 mx-2">Page {{ currentPage }}</span>
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage * pageSize >= totalPokemons"
        class="px-4 py-2 mx-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        Suivant
      </button>
    </div>
  </div>
</template>

