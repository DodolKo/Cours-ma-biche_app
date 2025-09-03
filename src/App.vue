<template>
  <div id="app">
    <!-- Écran de chargement initial -->
    <div v-if="isInitializing" class="app-initializing">
      <LoadingSpinner 
        size="large" 
        message="Initialisation de l'application..." 
      />
    </div>
    
    <!-- Application principale -->
    <RouterView v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const isInitializing = ref(true)

onMounted(() => {
  // L'initialisation se fait dans main.js, on peut masquer le spinner après un court délai
  setTimeout(() => {
    isInitializing.value = false
  }, 500) // Délai court pour éviter le flash
})
</script>

<style scoped>
#app {
  /* Styles globaux pour l'application */
  min-height: 100vh;
}

.app-initializing {
  @apply min-h-screen flex items-center justify-center bg-gray-50;
}
</style>