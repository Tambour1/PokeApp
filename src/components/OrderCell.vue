<script>
import utilsMixin from '../mixins/utilsMixin';
export default {
    name: 'OrderCell',
    mixins: [utilsMixin],
    props: {
        order: {
            type: Object,
            required: true,
        },
    },
};
</script>

<template>
    <div class="bg-yellow-50 bg-opacity-30 rounded-lg p-6 border border-gray-300 shadow flex flex-col">
        <div class="flex justify-between mb-4">
            <p class="font-semibold text-gray-700">Commande du {{ order.date }}</p>
            <p class="text-gray-700 font-bold">{{ convertPrice(order.totalPrice) }}</p>
        </div>
        <div class="overflow-y-auto max-h-72 scrollbar-hide">
            <ul>
                <li v-for="item in order.items" :key="item.id"
                    class="flex items-center justify-between text-gray-700 rounded-lg bg-gray-100 border mt-2 p-2">
                    <img :src="item.sprite" :alt="item.name" @click="$router.push({ name: 'PokeDetails', params: { id: item.id } })" class="w-12 h-12 object-cover cursor-pointer" />
                    <p>{{ item.name }} x{{ item.quantity }}</p>
                    <p>{{ convertPrice(item.price * item.quantity) }}</p>
                </li>
            </ul>
        </div>
    </div>
</template>
