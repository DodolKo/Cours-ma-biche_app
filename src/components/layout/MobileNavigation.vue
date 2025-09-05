<template>
  <!-- Navigation mobile en bas d'écran - Design moderne et accessible -->
  <nav 
    class="mobile-nav"
    role="navigation" 
    aria-label="Navigation principale mobile"
  >
    <div class="flex justify-around items-center px-2">
      <!-- Programme/Program -->
      <RouterLink
        to="/program"
        class="mobile-nav-item"
        :class="{ active: $route.name === 'Program' }"
        aria-label="Programme"
      >
        <svg 
          class="mobile-nav-icon" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span class="mobile-nav-label">Programme</span>
      </RouterLink>

      <!-- Historique/Stats -->
      <RouterLink
        to="/stats"
        class="mobile-nav-item stats-link"
        :class="{ active: $route.name === 'Stats' }"
        aria-label="Statistiques"
      >
        <svg 
          class="mobile-nav-icon" 
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
        <span class="mobile-nav-label">Stats</span>
      </RouterLink>

      <!-- Profil/Santé -->
      <RouterLink
        to="/profile"
        class="mobile-nav-item profile-link"
        :class="{ active: $route.name === 'Profile' }"
        aria-label="Profil"
      >
        <svg 
          class="mobile-nav-icon" 
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
        <span class="mobile-nav-label">Profil</span>
      </RouterLink>

      <!-- Objectifs -->
      <RouterLink
        to="/goals"
        class="mobile-nav-item"
        :class="{ active: $route.name === 'Goals' }"
        aria-label="Objectifs"
      >
        <svg 
          class="mobile-nav-icon" 
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
        <span class="mobile-nav-label">Objectifs</span>
      </RouterLink>
    </div>
  </nav>
</template>

<script setup>
// Aucune logique nécessaire - la navigation est gérée par Vue Router
// Les styles sont définis dans style.css global pour une cohérence maximale
// L'accessibilité est assurée par les attributs ARIA et la structure sémantique
</script>

<style scoped>
/* 
  Les styles de navigation sont définis dans src/style.css 
  pour maintenir la cohérence globale et éviter la duplication
  
  Classes utilisées:
  - .mobile-nav : conteneur principal
  - .mobile-nav-item : éléments de navigation
  - .mobile-nav-icon : icônes
  - .mobile-nav-label : libellés
  - .active : état actif
*/

/* Force le contraste pour tous les textes en mode sombre */
.dark .mobile-nav-label,
.dark .mobile-nav-item {
  color: #ffffff !important;
}

/* Surcharger les classes Tailwind en mode sombre */
.dark .text-gray-500,
.dark .text-gray-600,
.dark .text-gray-700 {
  color: #ffffff !important;
}
</style>
