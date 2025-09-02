<template>
  <button
    type="submit"
    :disabled="loading"
    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
  >
    <!-- Icône de chargement -->
    <span v-if="loading" class="absolute left-0 inset-y-0 flex items-center pl-3">
      <svg class="h-5 w-5 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path>
      </svg>
    </span>
    
    {{ loading ? 'Chargement...' : (isLoginMode ? 'Se connecter' : 'Créer le compte') }}
  </button>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    default: false
  },
  isLoginMode: {
    type: Boolean,
    default: true
  }
})
</script>
