<template>
  <div v-if="pendingCount > 0" class="fixed bottom-16 left-4 right-4 z-40">
    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="flex-shrink-0">
            <svg class="w-5 h-5 text-yellow-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          </div>
          <div>
            <p class="text-sm font-medium text-yellow-800">
              {{ pendingCount }} {{ pendingCount === 1 ? 'donnée' : 'données' }} en attente de synchronisation
            </p>
            <p class="text-xs text-yellow-600">
              Les données seront synchronisées à la reconnexion
            </p>
          </div>
        </div>
        <button
          v-if="isOnline"
          @click="forceSync"
          :disabled="isSyncing"
          class="text-xs bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 disabled:opacity-50 transition-colors"
        >
          {{ isSyncing ? 'Sync...' : 'Synchroniser' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { offlineSync } from '@/utils/offlineSync'

const pendingCount = ref(0)
const isOnline = ref(navigator.onLine)
const isSyncing = ref(false)

const updatePendingCount = () => {
  pendingCount.value = offlineSync.getPendingCount()
}

const forceSync = async () => {
  if (!isOnline.value || isSyncing.value) return
  
  isSyncing.value = true
  try {
    await offlineSync.syncPendingOperations()
    updatePendingCount()
  } catch (error) {
    console.error('Erreur lors de la synchronisation forcée:', error)
  } finally {
    isSyncing.value = false
  }
}

const handleOnline = () => {
  isOnline.value = true
  // Synchroniser automatiquement à la reconnexion
  setTimeout(() => {
    forceSync()
  }, 1000)
}

const handleOffline = () => {
  isOnline.value = false
}

onMounted(() => {
  updatePendingCount()
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  // Vérifier périodiquement le nombre d'opérations en attente
  const interval = setInterval(updatePendingCount, 5000)
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})
</script>



