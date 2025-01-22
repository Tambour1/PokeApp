import { useCartStore } from '../stores/cartStore';
import { useNotificationStore } from '../stores/notificationStore';

export default {
  methods: {
    // Ajouter un pokemon au panier
    addPokemonToCart(pokemon) {
      const cartStore = useCartStore();
      const notificationStore = useNotificationStore();
      const item = {
        id: pokemon.id,
        name: pokemon.name,
        price: pokemon.base_experience ? pokemon.base_experience : 1,
        quantity: 1,
        sprite: pokemon.sprites.front_default,
      };
      cartStore.addItem(item);
      notificationStore.addNotification(`${this.firstCapitalLetter(pokemon.name)} ajouté au panier`);
    },

    // Vérifie si un pokemon est dans le panier
    isPokemonInCart(pokemonId) {
      const cartStore = useCartStore();
      return cartStore.isInCart(pokemonId);
    }
  },
};
