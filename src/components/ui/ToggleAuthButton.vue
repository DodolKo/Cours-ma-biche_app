<template>
  <button
    type="button"
    @click="$emit('toggle')"
    class="text-indigo-600 hover:text-indigo-500 font-medium transition-colors duration-200"
  >
    {{ isLoginMode 
      ? 'Pas encore de compte ? Créer un compte' 
      : 'Déjà un compte ? Se connecter'
    }}
  </button>
</template>

<script setup>
defineProps({
  isLoginMode: {
    type: Boolean,
    default: true
  }
})

defineEmits(['toggle'])
</script>
