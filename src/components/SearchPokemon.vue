<script>
import { getPokemonByName } from "../../services/httpClient";
import PokeDetails from "./PokeDetails.vue";
export default {
  name: "SearchPokemon",
  components: {
    PokeDetails,
  },
  data() {
    return {
      search: "",
      pokemon: null,
    };
  },
  methods: {
    async searchPokemon() {
      if (!this.search.trim()) {
        this.errorMessage = "Veuillez saisir un nom de Pokémon.";
        return;
      }      
        this.pokemon = await getPokemonByName(this.search.toLowerCase());      
    },
  },
};
</script>

<template>
  <div class="bg-gray-100 w-screen h-screen">
    <div class="mx-10 flex flex-col">
      <input
        v-model="search"
        type="text"
        placeholder="Entrez le nom du Pokémon"
        class = "bg-white p-5 rounded-lg mt-8 border border-blue-500 text-blue-700"
      />
    <button @click="searchPokemon">Rechercher</button>
    </div>

    <div v-if="pokemon">
      <PokeDetails :id="pokemon.id"></PokeDetails>      
    </div>
  </div>
</template>
