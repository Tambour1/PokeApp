<script>
import { useOrderStore } from '../stores/orderStore';
import utilsMixin from '../mixins/utilsMixin';
import OrderCell from './OrderCell.vue';

export default {
    name: 'Orders',
    mixins: [utilsMixin],
    components: {
        OrderCell,
    },
    data() {
        const orderStore = useOrderStore();
        return {
            orderStore,
        };
    },
    computed: {
        orders() {
            return this.orderStore.getOrders();
        },
    },
};
</script>

<template>
    <div class="bg-secondary min-h-screen p-6">
        <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">Historique des commandes</h1>

        <div v-if="orders.length === 0" class="text-center text-gray-600">
            <p class="text-xl">Aucune commande passée.</p>
        </div>

        <div v-else>
            <ul class="flex flex-wrap gap-6 justify-center">
                <li v-for="(order, index) in orders" :key="index">
                    <OrderCell :order="order" />
                </li>
            </ul>
        </div>
    </div>
</template>


