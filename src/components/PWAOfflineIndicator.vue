<template>
  <div v-if="!isOnline" class="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white">
    <div class="flex items-center justify-center py-2 px-4">
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"></path>
      </svg>
      <span class="text-sm font-medium">
        Mode hors ligne - Vos données seront synchronisées à la reconnexion
      </span>
    </div>
  </div>

  <div v-if="isOnline && wasOffline" class="fixed top-0 left-0 right-0 z-50 bg-green-600 text-white">
    <div class="flex items-center justify-center py-2 px-4">
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span class="text-sm font-medium">
        Connexion rétablie - Synchronisation en cours...
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isOnline = ref(navigator.onLine)
const wasOffline = ref(false)

const handleOnline = () => {
  isOnline.value = true
  wasOffline.value = true
  
  // Masquer le message de reconnexion après 3 secondes
  setTimeout(() => {
    wasOffline.value = false
  }, 3000)
}

const handleOffline = () => {
  isOnline.value = false
  wasOffline.value = false
}

onMounted(() => {
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})
</script>

