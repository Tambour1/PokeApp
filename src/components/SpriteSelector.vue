<script>
export default {
  props: {
    sprites: {
      type: Array,
      required: true,
    },
  },
  methods: {
    selectSprite(sprite) {
      this.$emit("sprite-selected", sprite);
    },
  },
};
</script>

<template>
  <div class="grid grid-cols-5 gap-4 justify-center">
    <img
      v-for="sprite in sprites"
      :key="sprite"
      :src="sprite"
      :alt="sprite"
      class="w-32 h-32 cursor-pointer"
      @click="selectSprite(sprite)"
    />
  </div>
</template>
