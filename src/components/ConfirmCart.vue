<script>
import { useCartStore } from '../stores/cartStore';
import { RouterLink } from 'vue-router';
import utilsMixin from '../mixins/utilsMixin';
import cartPokemonMixin from '../mixins/cartPokemonMixin';

export default {
    name: 'ConfirmCart',
    mixins: [utilsMixin, cartPokemonMixin],
    components: {
        RouterLink,
    },
    data() {
        const cartStore = useCartStore();
        return {
            cartStore,
            isOrder: false,
        };
    },
    methods: {
        placeOrder() {
            this.cartStore.clearCart();
            this.isOrder = true;
        },
    },
};
</script>
<template>
    <div v-if="!isOrder" class="bg-secondary min-h-screen p-6">
        <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">Résumé de votre commande</h1>

        <div v-if="pokemonsInCart.length === 0" class="text-center text-gray-600">
            <p class="text-xl">Votre panier est vide.</p>
        </div>

        <div v-else class="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
            <!-- Résumé des pokemon -->
            <ul class="space-y-4">
                <li v-for="pokemon in pokemonsInCart" :key="pokemon.id" class="flex justify-between items-center border-b py-2">
                    <span class="font-semibold text-gray-700">{{ pokemon.name }} x{{ pokemon.quantity }}</span>
                    <span class="text-gray-700">{{ convertPrice(pokemon.price * pokemon.quantity) }}</span>
                </li>
            </ul>

            <!-- Résumé du panier -->
            <div class="mt-8 pt-6">
                <div class="flex justify-between text-lg">
                    <span class="font-semibold text-gray-700">Nombre de Pokémons :</span>
                    <span class="text-gray-700">{{ totalPokemonsInCart }}</span>
                </div>
                <div class="flex justify-between text-lg mt-2">
                    <span class="font-semibold text-gray-700">Total :</span>
                    <span class="text-gray-700 font-bold">{{ convertPrice(totalPricePokemonsInCart) }}</span>
                </div>

                <!-- Bouton pour finaliser la commande -->
                <div class="flex justify-around mt-12 text-center">
                    <RouterLink to="/" class="bg-blue-500 text-white px-6 py-3 rounded-full shadow hover:bg-blue-600">
                        Retour à l'accueil</RouterLink>
                    <button @click="placeOrder"
                        class="bg-green-500 text-white px-6 py-3 rounded-full shadow hover:bg-green-600">
                        Confirmer la commande
                    </button>
                </div>
            </div>
        </div>
    </div>
    <!-- Message de la commande  -->
    <div v-else>
        <div class="bg-white rounded-lg shadow-lg p-6 mt-6">
            <p class="text-xl text-center text-green-500">Votre commande a bien été enregistrée !</p>
        </div>
    </div>
</template>