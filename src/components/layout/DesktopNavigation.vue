<template>
  <!-- Navigation desktop en haut d'écran - Design épuré et professionnel -->
  <nav 
    class="desktop-nav"
    role="navigation" 
    aria-label="Navigation principale desktop"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center">
        <!-- Logo/Titre de l'application -->
        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <!-- Logo de l'app -->
            <AppLogo size="medium" force-web />
            
            <!-- Titre -->
            <h1 class="text-xl font-bold text-gray-800">
              Running App
            </h1>
          </div>
        </div>

        <!-- Navigation principale -->
        <div class="flex items-center space-x-1">
          <!-- Chronomètre masqué sur desktop/tablette - visible uniquement sur mobile -->

          <RouterLink
            to="/stats"
            class="desktop-nav-item"
            :class="{ active: $route.name === 'Stats' }"
          >
            <svg 
              class="w-5 h-5 mr-2 inline" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Statistiques
          </RouterLink>

          <RouterLink
            to="/profile"
            class="desktop-nav-item"
            :class="{ active: $route.name === 'Profile' }"
          >
            <svg 
              class="w-5 h-5 mr-2 inline" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profil
          </RouterLink>

          <RouterLink
            to="/goals"
            class="desktop-nav-item"
            :class="{ active: $route.name === 'Goals' }"
          >
            <svg 
              class="w-5 h-5 mr-2 inline" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            Objectifs
          </RouterLink>
        </div>

        <!-- Actions utilisateur -->
        <div class="flex items-center space-x-4">
          <!-- Nom de l'utilisateur -->
          <span class="text-sm text-gray-600 hidden md:block">
            {{ userDisplayName }}
          </span>
          
          <!-- Bouton de déconnexion -->
          <button
            @click="handleLogout"
            class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
            title="Déconnexion"
            aria-label="Se déconnecter"
          >
            <svg 
              class="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLogo from '@/components/ui/AppLogo.vue'

// Stores et router
const router = useRouter()
const authStore = useAuthStore()

// Computed properties
const userDisplayName = computed(() => {
  return authStore.userFullName || authStore.user?.email || 'Utilisateur'
})

/**
 * Gestion de la déconnexion
 * Déconnecte l'utilisateur et redirige vers la page de connexion
 */
async function handleLogout() {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Erreur de déconnexion:', error)
    // En cas d'erreur, forcer la redirection vers login
    router.push('/login')
  }
}
</script>

<style scoped>
/* 
  Les styles de navigation sont définis dans src/style.css 
  pour maintenir la cohérence globale
  
  Classes utilisées:
  - .desktop-nav : conteneur principal
  - .desktop-nav-item : éléments de navigation
  - .active : état actif
*/
</style>
