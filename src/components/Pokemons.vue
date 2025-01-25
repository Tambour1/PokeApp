<script>
import { getPokemonsPaginated, getPokemonByName, getPokemons } from "../../services/httpClient";
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid';
import cartPokemonMixin from '@/mixins/cartPokemonMixin';
import PokeCard from "./PokeCard.vue";
import SpriteSelector from './SpriteSelector.vue';

export default {
  name: "Pokemons",
  mixins: [cartPokemonMixin],
  components: {
    PokeCard,
    MagnifyingGlassIcon,
    SpriteSelector,
  },
  data() {
    return {
      pokemonsPaginated: [],
      pokemons: [],
      loading: true,
      error: null,
      currentPage: 1,
      pageSize: 12,
      total: 0,
      search: "",
      currentPokemon: null,
      isPaginated: false,
    };
  },
  methods: {
    // Récupère la liste des Pokémons
    async fetchPokemons() {
      try {
        this.isPaginated = true;
        this.loading = true;
        const offset = (this.currentPage - 1) * this.pageSize;
        const pokemonPaginatedList = await getPokemonsPaginated(this.pageSize, offset);
        const pokemonList = await getPokemons();
        this.pokemons = pokemonList.results;
        this.total = pokemonPaginatedList.count;

        const promises = pokemonPaginatedList.results.map((pokemon) =>
          fetch(pokemon.url).then((res) => res.json())
        );

        const pokemonsData = await Promise.all(promises);

        this.pokemonsPaginated = pokemonsData.map((pokemonData) => ({
          id: pokemonData.id,
          name: pokemonData.name,
          sprites: pokemonData.sprites,
          types: pokemonData.types,
          height: pokemonData.height,
          weight: pokemonData.weight,
          base_experience: pokemonData.base_experience,
        }));

        this.foundPokemon = null;
      } catch (error) {
        this.error = "Impossible de récupérer la liste des Pokémons.";
      } finally {
        this.loading = false;
      }
    },
    // Recherche un Pokémon par son nom
    async searchPokemon() {
      this.isPaginated = false;
      if (!this.search.trim()) {
        this.error = "Veuillez saisir un nom de Pokémon.";
        return;
      }

      try {
        this.loading = true;

        const filteredNames = this.pokemons
          .map((pokemon) => pokemon.name)
          .filter((name) =>
            name.toLowerCase().includes(this.search.toLowerCase())
          );

        const promises = filteredNames.map((name) =>
          getPokemonByName(name)
        );
        this.pokemonsPaginated = await Promise.all(promises);
        this.error = null;
      } catch (error) {
        this.error = "Une erreur s'est produite lors de la recherche.";
        this.pokemons = [];
      } finally {
        this.loading = false;
      }
    },

    // Change la page courante
    changePage(newPage) {
      this.currentPage = newPage;
      this.fetchPokemons();
    },
    // Réinitialise la recherche
    clearSearch() {
      this.search = "";
      this.fetchPokemons();
    },
    // Met à jour le sprite du Pokémon
    updatePokemonSprite(sprite) {
      if (this.currentPokemon) {
        this.currentPokemon.sprites.front_default = sprite;
      }
      this.closeSpriteSelector();
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
        <MagnifyingGlassIcon class="w-7 h-7 text-primary ml-2" />
        <input v-model="search" type="text" placeholder="Entrez le nom d'un Pokémon"
          class="flex-1 p-2 pl-4 text-primary bg-transparent outline-none" />
      </div>
      <div class="flex items-center gap-4 mt-4">
        <button @click="searchPokemon" class="px-4 py-2 bg-blue-500 text-white rounded">
          Rechercher
        </button>
        <button v-if="search" @click="clearSearch" class="px-4 py-2 bg-gray-400 text-white rounded">
          Réinitialiser
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-col items-center justify-center h-screen bg-secondary">
      <div class="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
      <p class="text-gray-500 text-xl font-bold">Chargement...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center h-screen">
      <p class="text-red-500 text-xl font-bold">{{ error }}</p>
    </div>

    <!-- Sélecteur de Sprite -->
    <div v-if="currentPokemon" class="flex flex-col items-center mt-10">
      <SpriteSelector :sprites="getSprites(currentPokemon)" @sprite-selected="updatePokemonSprite" />
      <button @click="closeSpriteSelector" class="mt-4 px-4 py-2 bg-red-500 text-white rounded">
        Fermer
      </button>
    </div>

    <div v-else class="bg-secondary mt-4">
      <!-- Liste des Pokémon paginée -->
      <div class="flex flex-wrap justify-center bg-secondary gap-4 p-4">
        <div v-for="pokemon in pokemonsPaginated" :key="pokemon.id" class="flex flex-col items-center">
          <PokeCard :pokemon="pokemon" :sprites="pokemon.sprites" />
          <div class="flex gap-4 mt-4">
            <button @click="addPokemonToCart(pokemon)"
              class="bg-gray-400 text-xs text-white px-4 py-2 rounded-full hover:bg-gray-600">
              Ajouter au panier
            </button>
            <button @click="openSpriteSelector(pokemon)"
              class="bg-blue-500 text-xs text-white px-4 py-2 rounded-full hover:bg-blue-700">
              Changer Sprite
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="isPaginated" class="flex justify-center mt-3 pb-12">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
          class="px-4 py-2 mx-2 bg-blue-500 text-white rounded disabled:opacity-50">
          Précédent
        </button>
        <span class="text-gray-900 px-4 py-2 mx-2">Page {{ currentPage }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage * pageSize >= total"
          class="px-4 py-2 mx-2 bg-blue-500 text-white rounded disabled:opacity-50">
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>