<script>
import utilsMixin from "../mixins/utilsMixin";
export default {
    name: "CartCell",
    mixins: [utilsMixin],
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    emits: ["decrease", "increase", "remove"],
    methods: {
        // emettre moins
        emitDecrease() {
            this.$emit("decrease");
        },
        // emettre plus
        emitIncrease() {
            this.$emit("increase");
        },
        // emettre supprimer
        emitRemove() {
            this.$emit("remove");
        },
    },
};
</script>

<template>
    <div class="flex justify-between items-center p-4 border rounded-lg shadow-sm">
        <!-- Image et Nom -->
        <div class="w-56 flex items-center justify-between">
            <img width="120" :src="item.sprite" :alt="item.name"
                @click="$router.push({ name: 'PokeDetails', params: { id: item.id } })"
                class="cursor-pointer" />
            <p class="text-lg font-semibold text-gray-500">{{ item.name }}</p>
        </div>

        <!-- Boutons Quantité -->
        <div class="flex items-center space-x-10 p-4">
            <button @click="emitDecrease"
                class="text-2xl font-semibold text-gray-700 bg-gray-200 rounded-full px-3 py-1 hover:bg-gray-300">
                -
            </button>
            <span class="text-xl font-semibold text-gray-800">{{
                item.quantity
            }}</span>
            <button @click="emitIncrease"
                class="text-2xl font-semibold text-gray-700 bg-gray-200 rounded-full px-3 py-1 hover:bg-gray-300">
                +
            </button>
        </div>

        <!-- Prix -->
        <div class="text-right p-4">
            <p class="text-xl font-bold text-gray-700">
                {{ convertPrice(item.price * item.quantity) }}
            </p>
            <button @click="emitRemove" class="text-red-500 hover:underline text-sm mt-3">
                Supprimer
            </button>
        </div>
    </div>
</template>
