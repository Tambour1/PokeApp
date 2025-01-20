<script>
export default {
  name: "PokeCard",
  props: {
    pokemon: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      pokemonColor: "",
      typeColors: {
        normal : "#AAA67F",
        fighting: "#C12239",
        flying: "#A891EC",
        poison: "#A43E9E",
        ground: "#DEC16B",
        rock: "#B69E31",
        bug: "#A7B723",
        ghost: "#70559B",
        steel: "#B7B9D0",
        fire: "#F57D31",
        water: "#6493EB",
        grass: "#74CB48",     
        electric: "#F9CF30",
        psychic: "#FB5584",
        ice: "#9AD6DF",         
        dragon: "#7037FF",
        dark: "#75574C",        
        fairy: "#E69EAC",
        stellar: "darkblue",
        unknown: "gray",
      },
      primaryType:""
    };
  },
  methods: {
    getTypeColor(type) {
      return this.typeColors[type] || "white";
    },
  },
  mounted() {
    this.primaryType = this.pokemon.types[0].type.name;
    this.pokemonColor = this.getTypeColor(this.primaryType);
  },
};
</script>

<template>
  <div class="border-8 rounded-md border-yellow-200 p-4 h-96 w-72" 
  :style="{ backgroundColor: pokemonColor }"
  >
  <!-- Nom du Pokémon et icône de type -->
  <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold">{{ pokemon.name }}</h2>
      <img
        :src="`/src/assets/types-icons/${primaryType}.png`"
        alt="Type Icon"
        width="30"
        height="30"
        class="ml-2"
      />
  </div>

  <img width="150" :src="pokemon.sprites.front_default" :alt="pokemon.name" class="bg-white mx-auto border-4 rounded-md border-gray-300" />
  
  <p class="text-center mt-1">Pokemon N°{{ pokemon.id }}</p>
  <div class="mx-auto text-center mt-4">
    <p><strong>Type(s):</strong> {{ pokemon.types.map(t => t.type.name).join(", ") }}</p>
    <p><strong>Taille:</strong> {{ pokemon.height }}</p>
    <p><strong>Poids:</strong> {{ pokemon.weight }}</p>
  </div>
  </div>
</template>
