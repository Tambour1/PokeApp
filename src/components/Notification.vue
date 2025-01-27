<script>
import { CheckIcon } from '@heroicons/vue/24/solid';
export default {
  name: "Notification",
  components: {
    CheckIcon,
  },
  props: {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
};
</script>

<template>

  <!-- Notification d'erreur -->
  <div v-if="type === 'error'" class="bg-red-500 p-4 rounded-md shadow-lg mb-2 max-w-lg w-auto break-words border-2 border-white animate-fade">
    <p class="text-white font-bold text-l text-center">
      {{ message }}
    </p>
  </div>

  <!-- Notification de succès -->
  <div v-else-if="type === 'success'" class="flex items-center justify-center space-x-3 bg-green-500 p-4 rounded-md shadow-lg mb-2 max-w-lg w-auto break-words border-2 border-white animate-fade">
    <p class="text-white font-bold text-l text-center">
      {{ message }}
    </p>
    <CheckIcon class="w-7 bg-white text-center text-green-500 rounded-full p-1"></CheckIcon>
  </div>

</template>

<style>
@keyframes fade {
  0% { opacity: 0; transform: translateY(-10px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; }
  100% { opacity: 0.7; transform: translateY(-5px); }
}
.animate-fade {
  animation: fade 4s ease-in-out forwards;
}

</style>
