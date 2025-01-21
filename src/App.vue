<script>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="bg-secondary w-screen h-screen font-pokemon">
    <header class="bg-primary text-white p-6 shadow-md">
      <nav class="flex justify-between items-center">
        <!--Pokeapp -->
        <div class="text-3xl font-bold tracking-wide">
          <RouterLink to="/" class="text-white hover:text-gray-200 hover:bg-transparent">PokeAPP</RouterLink>
        </div>
        
        <!-- Menu de navigation -->
        <div class="space-x-6">
          <RouterLink 
            to="/" 
            class="text-white text-lg font-semibold hover:text-gray-200 hover:bg-transparent"
          >
            Pokémons
          </RouterLink>
          <RouterLink 
            to="/pokemon" 
            class="text-white text-lg font-semibold hover:text-gray-200 hover:bg-transparent"
          >
            Trouver un Pokémon
          </RouterLink>
        </div>
      </nav>
    </header>
    <RouterView />
  </div>
</template>
