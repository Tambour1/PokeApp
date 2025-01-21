<script>
import { RouterLink } from "vue-router";
import { getPokemonById } from "../../services/httpClient";
import pokeMixins from "@/mixins/pokeMixins";
export default {
  name: "PokeDetails",
  mixins: [pokeMixins],
  components: {
    RouterLink,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      pokemon: {},
      typesSprites: [],
      loading: true,
      error: null,
    };
  },
  methods: {
    async fetchPokemonDetails() {
      try {
        const response = await getPokemonById(this.id);
        this.pokemon = await response;
        this.loading = false;
        const icons = await Promise.all(
          this.pokemon.types.map(async (type) => {
            const response = await fetch(type.type.url);
            const data = await response.json();
            const icon = data.sprites["generation-iv"]["diamond-pearl"].name_icon
              ? data.sprites["generation-iv"]["diamond-pearl"].name_icon
              : data.sprites["generation-vii"]["ultra-sun-ultra-moon"].name_icon;

            return icon;
          })
        );
        this.typesSprites = icons;
      } catch (error) {
        this.error = "Impossible de récupérer les détails du Pokémon.";
        this.loading = false;
      }
    },
    getStatColor(baseStat) {
      if (baseStat > 100) return "#4caf50";
      if (baseStat > 50) return "#ffc107";
      return "#f44336";
    },
  },
  mounted() {
    this.fetchPokemonDetails();
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

  <!-- PokemonDétails -->
  <div v-else
    class="w-4/12 font-pokemon bg-white rounded-lg shadow-lg overflow-hidden text-center mx-auto border border-gray-300 mt-10">
    <!-- Nom et numéro du pokemon -->
    <header class="bg-gray-200 flex items-center justify-between p-3">
      <RouterLink class="text-gray-600 text-3xl cursor-pointer hover:bg-transparent" to="/">←</RouterLink>
      <h1 class="text-gray-800 text-xl">{{ firstCapitalLetter(pokemon.name) }}</h1>
      <span class="text-gray-800 text-xl">#{{ pokemon.id }}</span>
    </header>
    <!-- L'image du pokemon -->
    <img :src="pokemon.sprites.front_default" :alt="pokemon.name" class="w-52 h-52 m-auto mt-6" />
    <!-- Les types -->
    <div class="flex justify-center mb-4 space-x-8">
      <img v-for="(type, index) in typesSprites" :src="type" :alt="pokemon.types[index].type.name"
        class="w-16 h-6" />
    </div>
    <!-- Les infos -->
    <div class="flex justify-around bg-gray-100 border-t border-b py-4">
      <div class="flex flex-col w-1/3 justify-around">
        <span class="text-gray-800 text-lg">{{ convertWeight(pokemon.weight) }}</span>
        <span class="text-gray-400 text-sm">Poids</span>
      </div>
      <div class="flex flex-col justify-around w-1/3 border-l-2 border-r-2 border-gray-300">
        <span class="text-gray-800 text-lg">{{ convertHeight(pokemon.height) }}</span>
        <span class="text-gray-400 text-sm">Taille</span>
      </div>
      <div class="flex flex-col w-1/3 justify-around">
        <span v-for="abilitie in pokemon.abilities" class="text-gray-800 text-lg">{{ abilitie.ability.name }}</span>
      </div>
    </div>
    <!-- Les stats -->
    <div class="p-4">
      <div v-for="stat in pokemon.stats" class="flex items-center mb-2">
        <span class="flex-1 text-gray-500 text-base">{{
          stat.stat.name.toUpperCase()
        }}</span>
        <div class="flex-auto h-2 bg-gray-200 rounded-lg overflow-hidden mx-2">
          <div class="h-full" :style="{
            width: `${stat.base_stat}%`,
            backgroundColor: getStatColor(stat.base_stat),
          }"></div>
        </div>
        <span class="flex-1 text-gray-500 text-base">{{
          stat.base_stat
        }}</span>
      </div>
    </div>
  </div>
</template>
