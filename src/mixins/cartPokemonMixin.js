import { useCartStore } from '../stores/cartStore';
import { useNotificationStore } from '../stores/notificationStore';

export default {
  data() {
    const cartStore = useCartStore();
    const notificationStore = useNotificationStore();
    return {
      cartStore,
      notificationStore,
    };
  },
  methods: {
    // Ajouter un pokemon au panier
    addPokemonToCart(pokemon) {
      const item = {
        id: pokemon.id,
        name: pokemon.name,
        price: pokemon.base_experience ? pokemon.base_experience : 1,
        quantity: 1,
        sprite: pokemon.sprites.front_default,
      };
      this.cartStore.addItem(item);
      this.notificationStore.addNotification(`${this.firstCapitalLetter(pokemon.name)} ajouté au panier`);
    },

    // Vérifie si un pokemon est dans le panier
    isPokemonInCart(pokemonId) {
      return this.cartStore.isInCart(pokemonId);
    }
  },

  computed: {
    // Pokemons dans le panier
    pokemonsInCart() {
      return this.cartStore.items;
    },

    // Nombre total de pokemons dans le panier
    totalPokemonsInCart() {
      return this.cartStore.totalItems;
    },

    // Prix total des pokemons dans le panier
    totalPricePokemonsInCart() {
      return this.cartStore.totalPrice;
    }
  }
};
