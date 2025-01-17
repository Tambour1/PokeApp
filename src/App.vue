<script>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="w-screen h-screen bg-gray-100">
    <header class="bg-gray-800 text-white p-4">
      <nav>
        <RouterLink to="/">Pokemons</RouterLink>
      </nav>
    </header>

    <RouterView />
  </div>
</template>
