<template>
  <div class="loading-spinner" :class="sizeClass">
    <div class="spinner"></div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  message: {
    type: String,
    default: ''
  }
})

const sizeClass = computed(() => {
  const sizes = {
    small: 'loading-small',
    medium: 'loading-medium', 
    large: 'loading-large'
  }
  return sizes[props.size] || sizes.medium
})
</script>

<style scoped>
.loading-spinner {
  @apply flex flex-col items-center justify-center p-4;
}

.spinner {
  @apply border-4 border-gray-200 border-t-green-500 rounded-full animate-spin;
}

.loading-small .spinner {
  @apply w-6 h-6 border-2;
}

.loading-medium .spinner {
  @apply w-8 h-8 border-4;
}

.loading-large .spinner {
  @apply w-12 h-12 border-4;
}

.loading-message {
  @apply mt-3 text-sm text-gray-600 text-center;
}
</style>
