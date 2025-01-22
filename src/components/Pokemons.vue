<script>
import { getPokemons, getPokemonByName } from "../../services/httpClient";
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import PokeCard from "./PokeCard.vue";

export default {
  name: "Pokemons",
  components: {
    PokeCard,
    MagnifyingGlassIcon,
  },
  data() {
    return {
      pokemons: [],
      loading: true,
      error: null,
      currentPage: 1,
      pageSize: 12,
      total: 0,
      search: "",
      foundPokemon: null,
    };
  },
  methods: {
    async fetchPokemons() {
      try {
        this.loading = true;
        const offset = (this.currentPage - 1) * this.pageSize;
        const pokemonList = await getPokemons(this.pageSize, offset);
        this.total = pokemonList.count;

        const promises = pokemonList.results.map((pokemon) =>
          fetch(pokemon.url).then((res) => res.json())
        );
        this.pokemons = await Promise.all(promises);
        this.foundPokemon = null; 
      } catch (error) {
        this.error = "Impossible de récupérer la liste des Pokémons.";
      } finally {
        this.loading = false;
      }
    },
    async searchPokemon() {
      if (!this.search.trim()) {
        this.error = "Veuillez saisir un nom de Pokémon.";
        return;
      }

      try {
        this.loading = true;
        this.foundPokemon = await getPokemonByName(this.search.toLowerCase());
        this.error = null;
      } catch (error) {
        this.error = "Pokémon introuvable.";
        this.foundPokemon = null;
      } finally {
        this.loading = false;
      }
    },
    changePage(newPage) {
      this.currentPage = newPage;
      this.fetchPokemons();
    },
    clearSearch() {
      this.search = "";
      this.foundPokemon = null;
      this.fetchPokemons();
    },
  },
  mounted() {
    this.fetchPokemons();
  },
};
</script>

<template>
  <div class="bg-secondary w-screen h-screen">
    <!-- Barre de recherche -->
    <div class="mx-10 flex flex-col mt-8">
      <div class="flex items-center bg-white p-2 rounded-full border border-gray-300 shadow">
        <!-- Icône de loupe -->
        <MagnifyingGlassIcon class="w-7 h-7 text-primary ml-2" />
        <input
          v-model="search"
          type="text"
          placeholder="Entrez le nom d'un Pokémon"
          class="flex-1 p-2 pl-4 text-primary bg-transparent outline-none"
        />
      </div>
      <div class="flex items-center gap-4 mt-4">
        <button
          @click="searchPokemon"
          class="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Rechercher
        </button>
        <button
          v-if="search"
          @click="clearSearch"
          class="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Réinitialiser
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center h-screen bg-secondary">
      <div
        class="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-gray-500 text-xl font-bold">Chargement...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center h-screen">
      <p class="text-red-500 text-xl font-bold">{{ error }}</p>
    </div>

    <!-- Pokémon trouvé -->
    <div v-else-if="foundPokemon" class="flex justify-center mt-10">
      <PokeCard :pokemon="foundPokemon" />
    </div>

    <!-- Liste des Pokémon paginée -->
    <div v-else class="bg-secondary mt-4">
      <ul class="flex flex-wrap justify-center bg-secondary gap-4 p-4">
        <li v-for="pokemon in pokemons" :key="pokemon.id">
          <PokeCard :pokemon="pokemon" />
        </li>
      </ul>

      <!-- Pagination -->
      <div class="flex justify-center mt-3 pb-12">
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
          :disabled="currentPage * pageSize >= total"
          class="px-4 py-2 mx-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>

