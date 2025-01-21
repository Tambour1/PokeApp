<script>
export default {
  name: "Notification",
  props: {
    message: {
      type: String,
      required: true,
    },
  },
};
</script>

<template>
  <div class="w-80 bg-white p-4 rounded-md shadow-lg mb-2 animate-fade-in-out">
    <p class="font-semibold text-black text-sm">{{ message }}</p>
  </div>
</template>

<style>
@keyframes fadeInOut {
  0% { opacity: 0; transform: translateY(-10px); }
  10% { opacity: 1; transform: translateY(0); }
  90% { opacity: 1; }
  100% { opacity: 0; transform: translateY(-10px); }
}
.animate-fade-in-out {
  animation: fadeInOut 3s ease-in-out forwards;
}
</style>
