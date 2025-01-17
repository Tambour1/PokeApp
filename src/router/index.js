import { createRouter, createWebHistory } from 'vue-router'
import Pokemons from '@/components/Pokemons.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Pokemons,
    },
  ],
})

export default router
