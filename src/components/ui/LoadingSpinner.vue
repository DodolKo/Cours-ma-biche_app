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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.spinner {
  border: 4px solid var(--gray-200);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-small .spinner {
  width: 1.5rem;
  height: 1.5rem;
  border-width: 2px;
}

.loading-medium .spinner {
  width: 2rem;
  height: 2rem;
  border-width: 4px;
}

.loading-large .spinner {
  width: 3rem;
  height: 3rem;
  border-width: 4px;
}

.loading-message {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: var(--gray-600);
  text-align: center;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
