<script>
import { RouterLink } from "vue-router";
import { getPokemonById } from "../../services/httpClient";
import utilsMixin from "@/mixins/utilsMixin";
import cartPokemonMixin from "@/mixins/cartPokemonMixin";
import { ShoppingBagIcon } from '@heroicons/vue/24/solid';
import PokeCard from "./PokeCard.vue";
import SpriteSelector from './SpriteSelector.vue';
import { useNotificationStore } from "@/stores/notificationStore";
export default {
  name: "PokeDetails",
  mixins: [utilsMixin, cartPokemonMixin],
  components: {
    RouterLink,
    ShoppingBagIcon,
    PokeCard,
    SpriteSelector,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    sprite: {
      type: String,
      required: true,
    },
  },
  data() {
    const notificationStore = useNotificationStore();
    return {
      pokemon: {},
      typesSprites: [],
      loading: false,
      showPreview: false,
      currentPokemon: null,
      currentSprite: null,
      notificationStore,
    };
  },
  methods: {
    // Récupère les infos du Pokémon
    async fetchPokemonDetails() {
      try {
        this.loading = true;

        // Récupération des détails du Pokémon
        const response = await getPokemonById(this.id);
        this.pokemon = await response;

        //Changement du sprite dans l'apercu
        if (this.pokemon.sprites.front_default) this.pokemon.sprites.front_default = this.sprite

        const icons = await Promise.all(
          this.pokemon.types.map(async (type) => {
            const response = await fetch(type.type.url);
            const data = await response.json();
            // Récupération de l'icone du type
            const icon = data.sprites["generation-iv"]["diamond-pearl"].name_icon
              ? data.sprites["generation-iv"]["diamond-pearl"].name_icon
              : data.sprites["generation-vii"]["ultra-sun-ultra-moon"].name_icon;

            return icon;
          })
        );

        this.typesSprites = icons;
      } catch (error) {
        this.notificationStore.addNotification("Impossible d'accéder aux détails du Pokémon", "error");
        console.error("Impossible d'accéder aux détails du Pokémon: " + error);
        await this.keepLoading();
      } finally {
        this.loading = false;
      }
    },
    // Change la couleur des stats
    getStatColor(stat) {
      if (stat >= 80) return "#4caf50";
      if (stat >= 50) return "#ffc107";
      return "#f44336";
    },
    // Met à jour le sprite du Pokémon
    updatePokemonSprite(sprite) {
      this.currentSprite = sprite;
      if (this.currentPokemon) {
        this.currentPokemon.sprites.front_default = sprite;
      }
      this.closeSpriteSelector();
    },
  },
  mounted() {
    this.fetchPokemonDetails();
  },
};
</script>

<template>
  <!-- Loading -->
  <div v-if="loading" class="flex flex-col items-center justify-center h-screen bg-secondary">
    <div class="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mb-4"></div>
    <p class="text-gray-500 text-xl font-bold">Chargement...</p>
  </div>

  <div v-if="currentPokemon" class="flex flex-col items-center mt-10">
    <SpriteSelector :sprites="getSprites(currentPokemon)" @sprite-selected="updatePokemonSprite" />
    <button @click="closeSpriteSelector" class="mt-4 px-4 py-2 bg-red-500 text-white rounded">
      Fermer
    </button>
  </div>

  <!-- PokemonDétails -->
  <div v-else class="flex justify-center px-4 sm:px-0">
    <div class="flex flex-col w-full sm:w-8/12 md:w-6/12 lg:w-4/12">
      <div
        class="w-full font-pokemon bg-white rounded-lg shadow-lg overflow-hidden text-center mx-auto border border-gray-300 mt-10">
        <!-- Nom et numéro du pokemon -->
        <header class="bg-gray-200 flex items-center justify-between p-3">
          <button class="text-gray-600 text-3xl cursor-pointer hover:bg-transparent" @click="$router.go(-1)">←</button>
          <h1 v-if="pokemon.name" class="text-gray-800 text-xl">{{ firstCapitalLetter(pokemon.name) }}</h1>
          <span class="text-gray-800 text-xl">#{{ pokemon.id }}</span>
        </header>

        <!-- L'image du pokemon -->
        <img :src="currentSprite || sprite" :alt="pokemon.name"
          class="w-52 h-52 m-auto mt-6 cursor-pointer sm:w-40 sm:h-40" @mouseover="this.showPreview = true"
          @mouseleave="this.showPreview = false" />

        <!-- Les types -->
        <div class="flex justify-center mb-4 space-x-8 relative flex-wrap">
          <img v-for="(type, index) in typesSprites" :src="type" :alt="pokemon.types[index].type.name"
            class="w-16 h-6" />
          <!-- Dans le panier -->
          <transition name="shopping-icon">
            <ShoppingBagIcon v-if="isPokemonInCart(pokemon.id, currentSprite || sprite)"
              v-cart-icon="isPokemonInCart(pokemon.id, currentSprite || sprite)" class="right-6" />
          </transition>
        </div>

        <!-- Les infos -->
        <div class="flex flex-row justify-around bg-gray-100 border-t border-b py-4">
          <div class="flex flex-col w-1/3 justify-around mb-4 sm:mb-0">
            <span class="text-gray-800 text-lg">{{ convertWeight(pokemon.weight) }}</span>
            <span class="text-gray-400 text-sm">Poids</span>
          </div>
          <div class="flex flex-col justify-around w-1/3 border-l-2 border-r-2 border-gray-300 mb-4 sm:mb-0">
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
            <span class="flex-1 text-gray-500 text-base">{{ stat.stat.name.toUpperCase() }}</span>
            <div class="flex-auto h-2 bg-gray-200 rounded-lg overflow-hidden mx-2">
              <div class="h-full" :style="{
                width: `${stat.base_stat}%`,
                backgroundColor: getStatColor(stat.base_stat),
              }"></div>
            </div>
            <span class="flex-1 text-gray-500 text-base">{{ stat.base_stat }}</span>
          </div>
        </div>
      </div>

      <!-- Ajouter au panier -->
      <div class="flex justify-center gap-4 mt-4">
        <button @click="addPokemonToCart(pokemon)"
          class="bg-gray-400 text-white px-4 py-2 rounded-full hover:bg-gray-600">
          Ajouter au panier
        </button>

        <button @click="openSpriteSelector(pokemon)"
          class="bg-blue-500 text-xs text-white px-4 py-2 rounded-full hover:bg-blue-700">
          Changer Image
        </button>
      </div>

    </div>

    <!-- Aperçu de la carte-->
    <div v-if="showPreview" class="absolute right-0 top-1/4 transform -translate-x-2/4 mr-8 sm:translate-x-0">
      <PokeCard :pokemon="pokemon" :is-preview="showPreview" />
    </div>
  </div>
</template>

<style scoped>
.shopping-icon-enter-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.shopping-icon-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.shopping-icon-enter-from,
.shopping-icon-leave-to {
  transform: scale(0);
  opacity: 0;
}

.shopping-icon-enter-to,
.shopping-icon-leave-from {
  transform: scale(1);
  opacity: 1;
}
</style>
