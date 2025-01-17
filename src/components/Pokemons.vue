<script>
import { getPokemons } from "../../services/httpClient";
import PokeCard from "./PokeCard.vue";
export default {
  name: "Pokemons",
  components: {
    PokeCard,
  },
  data() {
    return {
      pokemons: [],
    };
  },
  methods: {
    async fetchPokemons() {
      const pokemonList = await getPokemons(6);
      const promises = pokemonList.results.map(pokemon => fetch(pokemon.url).then(res => res.json()));
      this.pokemons = await Promise.all(promises);
    }
  },
  mounted() {
    this.fetchPokemons();
  },
};
</script>

<template>
  <div>
    <h1>Pokemons</h1>
    <ul>
      <li v-for="pokemon in pokemons" :key="pokemon.id">
        <PokeCard :pokemon="pokemon"></PokeCard>
      </li>
    </ul>
  </div>
</template>
