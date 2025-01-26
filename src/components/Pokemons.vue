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

      selectedType: "", // type de pokemon sélectionné
      listTypes: [], // liste des types de pokemons
      pokemonsByType: [], // tous les pokemons du type sélectionné
      pokemonsByTypePaginated: [], // pokemons du type sélectionné paginés
      currentPage: 1, // page courante des pokemons du type sélectionné
      pageSize: 10, // nombre de pokemons par page du type sélectionné

      pokemons: [], // tous les pokemons pour la recherche   
      search: "", // nom du pokemon recherché      
      isPaginated: false, // pagination activée ou non pour le pokemon recherché

      currentPokemon: null, // pokemon sélectionné pour le selecteur de sprite

      loading: false,
      error: null,
    };
  },
  methods: {
    // Récupère la liste des Pokémons
    async fetchPokemons(url = null) {
      try {
        this.isPaginated = true;
        this.loading = true;

        //Récupération des pokemons paginés
        const response = url ? await fetch(url).then((res) => res.json()) : await getPokemonsPaginated();
        this.nextPage = response.next;
        this.previousPage = response.previous;

        //Récupération des données des pokemons paginés
        const promises = response.results.map((pokemon) => fetch(pokemon.url).then((res) => res.json()));
        this.pokemonsPaginated = await this.mapPokemonData(promises);

        //Récupération des types de pokemons
        const types = await getTypes();
        this.listTypes = types.results.map((type) => type.name);

        //Récupération des pokemons pour la recherche
        const pokemonList = await getPokemons();
        this.pokemons = pokemonList.results;

        this.error = null;
      } catch (error) {
        this.error = "Impossible de récupérer la liste des Pokémons.";
      } finally {
        this.loading = false;
      }
    },

    async filterByType(type, typesList) {
      // Récupère tous les types par l'url
      const typesData = await Promise.all(typesList.results.map((t) => fetch(t.url).then((res) => res.json())));
      // Récupère les pokemons du type sélectionné
      const pokemonsInTypes = typesData.find((typeData) => typeData.name === type)?.pokemon || [];
      // Récupère les données des pokemons
      const promises = pokemonsInTypes.map((p) => fetch(p.pokemon.url).then((res) => res.json()));

      this.pokemonsByType = await this.mapPokemonData(promises);

      // Pagination des pokemons du type sélectionné
      this.currentPage = 1;
      this.paginatePokemonsByType();
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

    // Pagination des pokemons du type sélectionné
    paginatePokemonsByType() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      this.pokemonsByTypePaginated = this.pokemonsByType.slice(start, end);
    },

    // Recherche d'un pokemon par son nom
    async searchPokemon() {
      this.isPaginated = false;
      this.selectedType = "";

      // Vérifie si le champ de recherche est vide
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

    // Recupère les pokemons par type selectionné
    async onTypeChange() {
      if (this.selectedType) {
        const typesList = await getTypes();
        await this.filterByType(this.selectedType, typesList);
      } else {
        this.fetchPokemons();
      }
    },

    nextPageHandler() {
      if (this.selectedType) {
        if (this.currentPage * this.pageSize < this.pokemonsByType.length) {
          this.currentPage++;
          this.paginatePokemonsByType();
        }
      } else if (this.nextPage) {
        this.fetchPokemons(this.nextPage);
      }
    },

    previousPageHandler() {
      if (this.selectedType) {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.paginatePokemonsByType();
        }
      } else if (this.previousPage) {
        this.fetchPokemons(this.previousPage);
      }
    },

    clearSearch() {
      this.search = "";
      this.fetchPokemons();
    },

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
        <div class="flex-grow-[1]">
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
    <div v-if="loading" class="flex flex-col items-center justify-center bg-secondary">
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

    <!-- Pokémon paginés -->
    <div v-else-if="!loading" class="bg-secondary mt-4">
      <div class="flex flex-wrap justify-center bg-secondary gap-4 p-4">
        <div v-for="pokemon in (selectedType ? pokemonsByTypePaginated : pokemonsPaginated)" :key="pokemon.id"
          class="flex flex-col items-center">
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
      <div v-if="(isPaginated || selectedType) && !loading" class="flex justify-center mt-3 pb-12">
        <button @click="previousPageHandler" :disabled="selectedType ? currentPage === 1 : !previousPage"
          class="px-4 py-2 mx-2 bg-blue-500 text-white rounded disabled:opacity-50">
          Précédent
        </button>
        <span class="text-gray-900 px-4 py-2 mx-2">
          Page {{ selectedType ? currentPage : '...' }}
        </span>
        <button @click="nextPageHandler"
          :disabled="selectedType ? currentPage * pageSize >= pokemonsByType.length : !nextPage"
          class="px-4 py-2 mx-2 bg-blue-500 text-white rounded disabled:opacity-50">
          Suivant
        </button>
      </div>
    </div>
  </div>
</template>