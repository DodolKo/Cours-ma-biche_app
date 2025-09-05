<template>
  <!-- Toggle de thème - Design moderne et accessible -->
  <button
    @click="toggleTheme"
    class="theme-toggle"
    :class="{ compact: compact }"
    :title="isDark ? 'Passer en mode clair' : 'Passer en mode sombre'"
    :aria-label="isDark ? 'Passer en mode clair' : 'Passer en mode sombre'"
  >
    <!-- Icône soleil (mode clair) -->
    <svg 
      v-if="isDark" 
      class="theme-icon" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
    
    <!-- Icône lune (mode sombre) -->
    <svg 
      v-else 
      class="theme-icon" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path 
        stroke-linecap="round" 
        stroke-linejoin="round" 
        stroke-width="2" 
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

// Props
const props = defineProps({
  compact: {
    type: Boolean,
    default: false
  }
})

// Store
const themeStore = useThemeStore()

// Computed
const isDark = computed(() => themeStore.isDark)

// Méthodes
const toggleTheme = () => {
  themeStore.toggleTheme()
}
</script>

<style scoped>
.theme-toggle {
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  color: #6b7280;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  color: #111827;
  background-color: #f3f4f6;
}

.theme-toggle.compact {
  padding: 0.375rem;
}

.theme-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.theme-toggle.compact .theme-icon {
  width: 1rem;
  height: 1rem;
}

/* Animation de rotation pour l'icône */
.theme-toggle:hover .theme-icon {
  transform: rotate(15deg);
  transition: transform 0.2s ease;
}

/* Mode sombre */
.dark .theme-toggle {
  color: #d1d5db;
}

.dark .theme-toggle:hover {
  color: #ffffff;
  background-color: #374151;
}

/* Focus visible pour l'accessibilité */
.theme-toggle:focus-visible {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
}

.dark .theme-toggle:focus-visible {
  outline-offset: 2px;
}
</style>