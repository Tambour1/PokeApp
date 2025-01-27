<script>
import { getPokemonsPaginated, getPokemonByName, getPokemons, getTypes } from "../../services/httpClient";
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
      pokemonsPaginated: [], // tous les pokemons paginés
      nextPage: null, // url de la page suivante
      previousPage: null, // url de la page précédente

      fetchTypes: [], // promise types de pokemons
      selectedType: "", // type de pokemon sélectionné
      listTypes: [], // liste des types de pokemons
      pokemonsByTypePaginated: [], // pokemons du type sélectionné paginés
      nbPokemonsByType: 0, // nombre de pokemons du type sélectionné

      pokemons: [], // tous les pokemons pour la recherche 
      totalPokemon: 0, // nombre total de pokemons  
      search: "", // nom du pokemon recherché
      pokemonsSearchPaginated: [], // pokemons correspondant à la recherche paginés
      nbPokemonsSearch: 0, // nombre de pokemons correspondant à la recherche
      searchDone: false, // recherche effectuée

      currentPokemon: null, // pokemon sélectionné pour le selecteur de sprite

      apiCurrentPage: 1, // page courante des pokemons
      typeCurrentPage: 1, // page courante du type de pokemon
      searchCurrentPage: 1, // page courante de la recherche de pokemon
      pageSize: 10, // nombre de pokemons par page type ou recherche

      loading: false,
      error: null,
    };
  },
  methods: {
    // Récupère la liste des Pokémons
    async fetchPokemons(url = null) {
      try {
        this.loading = true;

        //Récupération des pokemons paginés
        const response = url ? await fetch(url).then((res) => res.json()) : await getPokemonsPaginated();
        this.nextPage = response.next;
        this.previousPage = response.previous;
        this.totalPokemon = response.count;

        //Récupération des données des pokemons paginés
        const promises = response.results.map((pokemon) => fetch(pokemon.url).then((res) => res.json()));
        this.pokemonsPaginated = await this.mapPokemonData(promises);

        //Récupération des pokemons pour la recherche
        const pokemonList = await getPokemons();
        this.pokemons = pokemonList.results;

        this.error = null;
      } catch (error) {
        this.error = "Impossible de récupérer la liste des Pokémons.";
        this.pokemonsPaginated = [];
      } finally {
        this.loading = false;
      }
    },

    // Recherche d'un pokemon par son nom
    async searchPokemon() {
      this.selectedType = "";

      // Vérifie si le champ de recherche est vide
      if (!this.search.trim()) {
        this.error = "Veuillez saisir un nom de Pokémon.";
        return;
      }

      try {
        this.loading = true;
        const start = (this.searchCurrentPage - 1) * this.pageSize;
        const end = this.searchCurrentPage * this.pageSize;

        // Filtrer les noms correspondant à la recherche
        const filteredNames = this.pokemons
          .map((pokemon) => pokemon.name)
          .filter((name) => name.toLowerCase().includes(this.search.toLowerCase()));

        this.nbPokemonsSearch = filteredNames.length;

        // Récupére les pokemons correspondant à la recherche
        const pageResults = filteredNames.slice(start, end);

        const promises = pageResults.map((name) => getPokemonByName(name));
        this.pokemonsSearchPaginated = await Promise.all(promises);

        this.searchDone = true;
        this.error = null;
      } catch (error) {
        this.error = "Une erreur s'est produite lors de la recherche.";
        this.pokemonsSearchPaginated = [];
      } finally {
        this.loading = false;
      }
    },

    // Récupère les pokemons par type
    async filterByType(type) {
      try {
        const start = (this.typeCurrentPage - 1) * this.pageSize;
        const end = this.pageSize;

        // Récupération des données du type
        const typeData = this.fetchTypes.results.find((t) => t.name === type);

        if (typeData) {
          // Récupération des données des pokemons du type
          const typeDetail = await fetch(typeData.url).then((res) => res.json());
          this.nbPokemonsByType = typeDetail.pokemon.length;
          const pokemonsInType = typeDetail.pokemon.slice(start, start + end);

          const promises = pokemonsInType.map((p) =>
            fetch(p.pokemon.url).then((res) => res.json())
          );

          this.pokemonsByTypePaginated = await this.mapPokemonData(promises);
        }

        this.error = null;
      } catch (error) {
        this.error = "Erreur lors du chargement des Pokémon par type.";
        this.pokemonsByTypePaginated = [];
      } finally {
        this.loading = false;
      }
    },

    // Mapping des données d'un pokemon
    async mapPokemonData(pokemonPromises) {
      const pokemonData = await Promise.all(pokemonPromises);
      return pokemonData.map((pokemon) => ({
        id: pokemon.id,
        name: pokemon.name,
        sprites: pokemon.sprites,
        types: pokemon.types,
        height: pokemon.height,
        weight: pokemon.weight,
        base_experience: pokemon.base_experience,
      }));
    },

    // Page suivante
    async nextPageHandler() {
      if (this.selectedType) {
        this.typeCurrentPage++;
        await this.filterByType(this.selectedType);
      } else if (this.search) {
        this.searchCurrentPage++;
        await this.searchPokemon();
      } else if (this.nextPage) {
        this.apiCurrentPage++;
        this.fetchPokemons(this.nextPage);
      }
    },

    // Page précédente
    async previousPageHandler() {
      if (this.selectedType && this.typeCurrentPage > 1) {
        this.typeCurrentPage--;
        await this.filterByType(this.selectedType);
      } else if (this.search && this.searchCurrentPage > 1) {
        this.searchCurrentPage--;
        await this.searchPokemon();
      } else if (this.previousPage) {
        this.apiCurrentPage--;
        this.fetchPokemons(this.previousPage);
      }
    },

    // Recupère les pokemons par type selectionné
    async onTypeChange() {
      if (this.selectedType) {
        await this.filterByType(this.selectedType);
      } else {
        this.fetchPokemons();
      }
    },

    // Clear de la recherche
    clearSearch() {
      this.search = "";
      this.searchDone = false;
      this.apiCurrentPage = 1;
      this.typeCurrentPage = 1;
      this.searchCurrentPage = 1;
      this.fetchPokemons();
    },

    // Met à jour le sprite du pokemon
    updatePokemonSprite(sprite) {
      if (this.currentPokemon) {
        this.currentPokemon.sprites.front_default = sprite;
      }
      this.closeSpriteSelector();
    },
  },
  computed: {
    // Calcul de la page courante
    currentPage() {
      if (this.selectedType) {
        return this.typeCurrentPage;
      } else if (this.search) {
        return this.searchCurrentPage;
      } else {
        return this.apiCurrentPage;
      }
    },
    // Calcul du nombre total de pages
    totalPages() {
      if (this.selectedType) {
        return Math.ceil(this.nbPokemonsByType / this.pageSize);
      } else if (this.search) {
        return Math.ceil(this.nbPokemonsSearch / this.pageSize);
      }
      return Math.ceil(this.totalPokemon / 20);
    },
    // Calcul des pokemons à afficher
    pokemonsToShow() {
      if (this.searchDone) {
        return this.pokemonsSearchPaginated;
      }
      if (this.selectedType) {
        return this.pokemonsByTypePaginated;
      }
      return this.pokemonsPaginated;
    }
  },
  watch: { // permet de réinitialiser les données de recherche à chaque recherche
    search(newSearch) {
      if (!newSearch) {
        this.pokemonsSearchPaginated = [];
      }
    }
  },
  async mounted() {
    this.fetchPokemons();
    this.fetchTypes = await getTypes();
    this.listTypes = this.fetchTypes.results.map((type) => type.name);
  },
};
</script>

<template>
  <div class="bg-secondary w-screen h-screen">
    <div class="mx-10 flex flex-col mt-8">
      <div class="flex items-center gap-4">
        <!-- Barre de recherche -->
        <div class="flex items-center bg-white p-2 rounded-full border border-gray-300 shadow flex-grow-[9]">
          <MagnifyingGlassIcon class="w-7 h-7 text-primary ml-2" />
          <input v-model="search" type="text" placeholder="Entrez le nom d'un Pokémon"
            class="flex-1 p-2 pl-4 text-primary bg-transparent outline-none" />
          <!-- Boutons de recherche et réinitialisation -->
          <div class="flex items-center gap-2 mr-4">
            <button @click="searchPokemon" class="px-4 py-2 bg-blue-500 text-white rounded">
              Rechercher
            </button>
            <button v-if="search" @click="clearSearch" class="px-4 py-2 bg-gray-400 text-white rounded">
              Réinitialiser
            </button>
          </div>
        </div>
        <!-- Sélecteur de type -->
        <div v-if="!search" class="flex-grow-[1]">
          <select v-model="selectedType" @change="onTypeChange"
            class="p-4 bg-primary text-white rounded-full shadow w-full">
            <option value="">Tous</option>
            <option v-for="type in listTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center bg-secondary w-full h-screen space-x-4">
      <div class="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
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

    <!-- Pokémon paginés -->
    <div v-else-if="!loading" class="bg-secondary mt-4">
      <div class="flex flex-wrap justify-center bg-secondary gap-4 p-4">
        <div v-for="pokemon in pokemonsToShow" :key="pokemon.id" class="flex flex-col items-center">
          <PokeCard :pokemon="pokemon" :sprites="pokemon.sprites" />
          <div class="flex gap-4 mt-4">
            <button @click="addPokemonToCart(pokemon)"
              class="bg-gray-400 text-xs text-white px-4 py-2 rounded-full hover:bg-gray-600">
              Ajouter au panier
            </button>
            <button @click="openSpriteSelector(pokemon)"
              class="bg-blue-500 text-xs text-white px-4 py-2 rounded-full hover:bg-blue-700">
              Changer Image
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div
        v-if="(pokemonsPaginated.length > 0 || pokemonsByTypePaginated.length > 0 || pokemonsSearchPaginated.length > 0) && !loading"
        class="flex justify-center mt-3 pb-12">
        <button @click="previousPageHandler" :disabled="currentPage === 1"
          class="px-4 py-2 mx-2 bg-blue-500 text-white rounded disabled:opacity-50">
          Précédent
        </button>

        <span class="text-gray-900 px-4 py-2 mx-2">
          Page {{ currentPage }} / {{ totalPages }}
        </span>

        <button @click="nextPageHandler"
          :disabled="currentPage === Math.ceil(totalPokemon / 20) || typeCurrentPage === Math.ceil(nbPokemonsByType / pageSize) || searchCurrentPage === Math.ceil(nbPokemonsSearch / pageSize)"
          class="px-4 py-2 mx-2 bg-blue-500 text-white rounded disabled:opacity-50">
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>