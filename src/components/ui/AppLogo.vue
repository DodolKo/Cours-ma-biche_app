<template>
  <div class="app-logo" :class="sizeClass">
    <img 
      :src="logoSrc" 
      :alt="alt" 
      :class="imageClass"
      @error="handleImageError"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { isMobile } from '@/utils/deviceDetection'

const props = defineProps({
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'xl'].includes(value)
  },
  alt: {
    type: String,
    default: 'Running App'
  },
  forceMobile: {
    type: Boolean,
    default: false
  },
  forceWeb: {
    type: Boolean,
    default: false
  }
})

const imageError = ref(false)

// Déterminer quel logo utiliser
const logoSrc = computed(() => {
  if (imageError.value) {
    return '/favicon.svg' // Fallback
  }
  
  // Force le type de logo si spécifié
  if (props.forceWeb) {
    return '/logo-web-192.png'
  }
  if (props.forceMobile) {
    return '/logo-192.png'
  }
  
  // Détection automatique basée sur l'appareil
  return isMobile() ? '/logo-192.png' : '/logo-web-192.png'
})

// Classes CSS pour les différentes tailles
const sizeClass = computed(() => {
  const sizes = {
    small: 'logo-small',
    medium: 'logo-medium',
    large: 'logo-large',
    xl: 'logo-xl'
  }
  return sizes[props.size] || sizes.medium
})

const imageClass = computed(() => {
  const baseClasses = 'transition-opacity duration-200'
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  return `${baseClasses} ${sizeClasses[props.size] || sizeClasses.medium}`
})

// Gestion des erreurs d'image
function handleImageError() {
  console.warn('Logo image failed to load, using fallback')
  imageError.value = true
}
</script>

<style scoped>
.app-logo {
  @apply flex items-center justify-center;
}

.logo-small {
  @apply w-6 h-6;
}

.logo-medium {
  @apply w-8 h-8;
}

.logo-large {
  @apply w-12 h-12;
}

.logo-xl {
  @apply w-16 h-16;
}
</style>
