<template>
  <button
    @click="handleLogout"
    :disabled="loading"
    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
  >
    <!-- Icône de chargement -->
    <span v-if="loading" class="mr-2">
      <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path>
      </svg>
    </span>
    
    <!-- Icône de déconnexion -->
    <svg v-else class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
    
    {{ loading ? 'Déconnexion...' : 'Se déconnecter' }}
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const loading = ref(false)

const emit = defineEmits(['logout-success', 'logout-error'])

async function handleLogout() {
  loading.value = true
  
  try {
    const result = await authStore.signOut()
    
    if (result.success) {
      emit('logout-success', result.message)
    } else {
      emit('logout-error', result.error)
    }
  } catch (error) {
    emit('logout-error', 'Erreur lors de la déconnexion')
  } finally {
    loading.value = false
  }
}
</script>
