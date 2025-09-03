<template>
  <!-- Layout principal de l'application - Mobile First avec détection d'appareil -->
  <div 
    class="app-layout min-h-screen"
    :class="deviceClasses"
  >
    <!-- Navigation desktop (visible uniquement sur desktop) -->
    <DesktopNavigation v-if="isDesktop" />
    
    <!-- Contenu principal -->
    <main 
      class="main-content flex-1"
      :class="{
        'pb-20': isMobile, // Espace pour la navigation mobile
        'pt-0': isDesktop   // Pas d'espace supplémentaire sur desktop
      }"
    >
      <!-- Slot pour le contenu des pages -->
      <slot />
    </main>
    
    <!-- Navigation mobile (visible uniquement sur mobile) -->
    <MobileNavigation v-if="isMobile" />
    
    <!-- Prompt d'installation PWA -->
    <PWAInstallPrompt />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import MobileNavigation from './MobileNavigation.vue'
import DesktopNavigation from './DesktopNavigation.vue'
import PWAInstallPrompt from '../PWAInstallPrompt.vue'
import { getDeviceType, getDeviceClasses, isMobile as checkIsMobile, isDesktop as checkIsDesktop } from '@/utils/deviceDetection'

// État réactif pour la détection d'appareil
const deviceType = ref('mobile')
const isMobile = ref(true)
const isDesktop = ref(false)

// Classes CSS dynamiques basées sur le type d'appareil
const deviceClasses = computed(() => {
  return getDeviceClasses()
})

/**
 * Met à jour les informations sur l'appareil
 * Appelé au montage et lors du redimensionnement
 */
function updateDeviceInfo() {
  deviceType.value = getDeviceType()
  isMobile.value = checkIsMobile()
  isDesktop.value = checkIsDesktop()
}

/**
 * Gestionnaire de redimensionnement de fenêtre
 * Optimisé avec debouncing pour éviter trop d'appels
 */
let resizeTimeout
function handleResize() {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(() => {
    updateDeviceInfo()
  }, 150) // Délai de 150ms pour optimiser les performances
}

// Lifecycle hooks
onMounted(() => {
  updateDeviceInfo()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (resizeTimeout) {
    clearTimeout(resizeTimeout)
  }
})
</script>

<style scoped>
/* Layout principal */
.app-layout {
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, var(--white) 0%, var(--secondary-color) 100%);
}

/* Contenu principal */
.main-content {
  flex: 1;
  overflow-x: hidden;
}

/* Optimisations pour les différents types d'appareils */
.device-mobile .main-content {
  /* Sur mobile, s'assurer que le contenu ne déborde pas */
  max-width: 100vw;
  padding-bottom: env(safe-area-inset-bottom, 0); /* Support pour les encoches */
}

.device-desktop .main-content {
  /* Sur desktop, centrer le contenu avec une largeur maximale */
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.device-tablet .main-content {
  /* Sur tablette, un compromis entre mobile et desktop */
  max-width: 768px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Transitions fluides lors du changement de type d'appareil */
.main-content {
  transition: padding-bottom 0.3s ease-in-out;
}

/* Support pour les appareils avec encoche (iPhone X+) */
@supports (padding: max(0px)) {
  .device-mobile .main-content {
    padding-bottom: max(5rem, env(safe-area-inset-bottom, 0));
  }
}
</style>
