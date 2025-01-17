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
        grass: "green",
        fire: "red",
        water: "blue",
        electric: "yellow",
        ice: "lightblue",
        fighting: "brown",
        poison: "purple",
        ground: "sandybrown",
        flying: "skyblue",
        psychic: "pink",
        bug: "limegreen",
        rock: "gray",
        ghost: "darkviolet",
        dragon: "darkorange",
        dark: "black",
        steel: "slategray",
        fairy: "lightpink",
        normal: "beige",
      },
    };
  },
  methods: {
    getTypeColor(type) {
      return this.typeColors[type] || "white";
    },
  },
  mounted() {
    const primaryType = this.pokemon.types[0].type.name;
    this.pokemonColor = this.getTypeColor(primaryType);
  },
};
</script>

<template>
  <div class="border p-4" :style="{ backgroundColor: pokemonColor }">
    <h2>{{ pokemon.name }}</h2>
    <img :src="pokemon.sprites.front_default" :alt="pokemon.name" />
  </div>
</template>
