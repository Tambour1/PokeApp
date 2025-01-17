<script>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
      <nav>
        <RouterLink to="/">Pokemons</RouterLink>    
      </nav>
  </header>

  <RouterView />
</template>
