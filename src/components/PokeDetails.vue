<script>
import { RouterLink } from 'vue-router';
export default {
  name: "PokeDetails",
  props: {
    pokemon: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      typesSprites: [],
      error: null,
    };
  },
  methods: {
    async fetchTypeIcons() {
      try {
        const icons = await Promise.all(
          this.pokemon.types.map(async (type) => {
            const response = await fetch(type.type.url);
            const data = await response.json();
            return data.sprites["generation-iv"]["diamond-pearl"].name_icon;
          })
        );
        this.typesSprites = icons;
      } catch (error) {
        this.error = error;
      }
    },

    getWeight() {
      return this.pokemon.weight / 10;
    },
    getHeight() {
      return this.pokemon.height / 10;
    },
    getStatColor(baseStat) {
      if (baseStat > 100) return "#4caf50";
      if (baseStat > 50) return "#ffc107";
      return "#f44336";
    },
  },
  async mounted() {
    this.fetchTypeIcons();
  },
  watch: {
    pokemon: {
      handler() {
        this.fetchTypeIcons();
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>


<template>
  <div class="w-5/12 font-pokemon bg-white rounded-lg shadow-lg overflow-hidden text-center mx-auto border border-gray-300">
    <!-- Nom et numéro du pokemon -->
    <header class="bg-gray-200 flex items-center justify-between p-3">
      <RouterLink class="text-gray-600 text-3xl cursor-pointer hover:bg-transparent" to="/">←</RouterLink>
      <h1 class="text-gray-800 text-xl">{{ pokemon.name.toUpperCase() }}</h1>
      <span class="text-gray-800 text-xl">#{{ pokemon.id }}</span>
    </header>
    <!-- L'image du pokemon -->
    <img :src="pokemon.sprites.front_default" :alt="pokemon.name"
      class="w-52 h-52 m-auto mt-6" />
    <!-- Les types -->
    <div class="flex justify-center mb-4">
      <img v-for="(type, index) in typesSprites" :src="type" :alt="pokemon.types[index].type.name"
        class="w-14 h-6 mx-4" />
    </div>
    <!-- Les infos -->
    <div class="flex justify-around bg-gray-100 border-t border-b py-4">
      <div class="flex flex-col w-1/3 justify-around">
        <span class="text-gray-800 text-lg">{{ getWeight() }} kg</span>
        <span class="text-gray-400 text-sm">Poids</span>
      </div>
      <div class="flex flex-col justify-around w-1/3 border-l-2 border-r-2 border-gray-300">
        <span class="text-gray-800 text-lg">{{ getHeight() }} m</span>
        <span class="text-gray-400 text-sm">Taille</span>
      </div>
      <div class="flex flex-col w-1/3 justify-around">
        <span v-for="abilitie in pokemon.abilities" class="text-gray-800 text-lg">{{ abilitie.ability.name }}</span>
      </div>
    </div>
    <!-- Les stats -->
    <div class="p-4">
      <div v-for="stat in pokemon.stats" class="flex items-center mb-2">
        <span class="flex-1 text-gray-500 text-base">{{ stat.stat.name.toUpperCase() }}</span>
        <div class="flex-auto h-2 bg-gray-200 rounded-lg overflow-hidden mx-2">
          <div class="h-full" :style="{ width: `${stat.base_stat}%`, backgroundColor: getStatColor(stat.base_stat) }">
          </div>
        </div>
        <span class="flex-1 text-gray-500 text-base">{{ stat.base_stat }}</span>
      </div>
    </div>
  </div>
</template>
