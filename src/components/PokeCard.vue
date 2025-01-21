<script>
import { useCartStore } from '../stores/cartStore';
import pokeMixins from '../mixins/pokeMixins';
export default {
  name: "PokeCard",
  mixins: [pokeMixins],
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
        normal: "#AAA67F",
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
      primaryType: ""
    };
  },
  methods: {
    // Récupère la couleur associée à un type
    getTypeColor(type) {
      return this.typeColors[type] || "white";
    },
    // Ajoute la carte au panier
    addToCart() {
      const cartStore = useCartStore();
      const item = {
        id: this.pokemon.id,
        name: this.pokemon.name,
        price: this.pokemon.base_experience ? this.pokemon.base_experience : 1,
        quantity: 1,
        sprite: this.pokemon.sprites.front_default,
      };
      cartStore.addItem(item);
    },
  },
  mounted() {
    this.primaryType = this.pokemon.types[0].type.name;
    this.pokemonColor = this.getTypeColor(this.primaryType);
  },
};
</script>

<template>
  <div
    class="border-8 rounded-md border-yellow-200 p-4 h-96 w-72 transition-transform transform hover:scale-105 hover:rotate-2 hover:shadow-xl"
    :style="{ backgroundColor: pokemonColor }">
    <!-- Nom du Pokémon et icône de type -->
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-white">{{ firstCapitalLetter(pokemon.name) }}</h2>
      <img :src="`/src/assets/types-icons/${primaryType}.png`" alt="Type Icon" width="30" height="30" class="ml-2" />
    </div>

    <!-- Image du Pokémon -->
    <img width="150" :src="pokemon.sprites.front_default" :alt="pokemon.name"
      class="bg-white mx-auto border-4 rounded-md border-gray-300 cursor-pointer"
      @click="$router.push({ name: 'PokeDetails', params: { id: pokemon.id } })" />

    <!-- Informations du Pokémon -->
    <div class="flex items-center justify-around bg-gray-100 rounded-md mt-1 text-gray-500 text-xs p-1">
      <p>N°{{ pokemon.id }}</p>
      <p>Taille: {{ convertHeight(pokemon.height) }}</p>
      <p>Poids: {{ convertWeight(pokemon.weight) }}</p>
    </div>

    <!-- Types du Pokémon -->
    <div class="flex mx-auto text-center mt-4 justify-around">
      <p v-for="type in pokemon.types" :style="{ backgroundColor: getTypeColor(type.type.name) }"
        class="rounded-lg border text-white font-semibold p-1">{{ type.type.name.toUpperCase() }}</p>
    </div>

    <!-- Prix -->
    <p class="text-center text-white text-2xl font-semibold mt-4 ml-1">{{ convertPrice(pokemon.base_experience) }}</p>
  </div>
  <!-- Ajouter au panier -->
  <div class="flex justify-center mt-5">
    <button @click="addToCart" class="bg-gray-400 text-white px-4 py-2 rounded-full hover:bg-gray-600">
      Ajouter au panier
    </button>
  </div>
</template>
