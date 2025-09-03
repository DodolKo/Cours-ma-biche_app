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
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const authStore = useAuthStore()
const isInitializing = ref(true)

// Surveiller l'état de chargement de l'authentification
watch(() => authStore.loading, (loading) => {
  if (!loading) {
    // L'auth est initialisée, masquer le spinner après un court délai
    setTimeout(() => {
      isInitializing.value = false
    }, 200)
  }
}, { immediate: true })

onMounted(() => {
  // Fallback de sécurité : masquer le spinner après 3 secondes max
  setTimeout(() => {
    isInitializing.value = false
  }, 3000)
})
</script>

<style scoped>
#app {
  /* Styles globaux pour l'application */
  min-height: 100vh;
}

.app-initializing {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--gray-50);
}
</style>