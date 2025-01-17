<script>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="w-screen h-screen">
    <header class="bg-gray-800 text-white p-4">
      <nav>
        <RouterLink to="/">Pokemons</RouterLink>
        <RouterLink to="/pokemon">Trouver un pokemon</RouterLink>
      </nav>
    </header>
    <RouterView />
  </div>
</template>
