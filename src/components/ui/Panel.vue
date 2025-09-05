<template>
  <div 
    :class="[
      'panel',
      `panel--${variant}`,
      `panel--${size}`,
      {
        'panel--elevated': elevated,
        'panel--interactive': interactive,
        'panel--glass': glass
      }
    ]"
    :style="customStyle"
    @click="handleClick"
  >
    <!-- Header optionnel -->
    <div v-if="$slots.header || title" class="panel__header">
      <slot name="header">
        <h3 v-if="title" class="panel__title">{{ title }}</h3>
      </slot>
    </div>

    <!-- Contenu principal -->
    <div class="panel__content">
      <slot />
    </div>

    <!-- Footer optionnel -->
    <div v-if="$slots.footer" class="panel__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'secondary', 'success', 'warning', 'danger'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  title: {
    type: String,
    default: null
  },
  elevated: {
    type: Boolean,
    default: true
  },
  interactive: {
    type: Boolean,
    default: false
  },
  glass: {
    type: Boolean,
    default: false
  },
  customColor: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['click'])

const customStyle = computed(() => {
  if (props.customColor) {
    return {
      '--panel-accent-color': props.customColor
    }
  }
  return {}
})

const handleClick = (event) => {
  if (props.interactive) {
    emit('click', event)
  }
}
</script>

<style scoped>
/* Variables pour les panneaux */
.panel {
  --panel-radius: 1rem;
  --panel-padding: 1.5rem;
  --panel-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --panel-shadow-hover: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --panel-shadow-elevated: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --panel-border: 1px solid var(--gray-200);
  --panel-bg: var(--white);
  --panel-text: var(--gray-800);
  --panel-text-muted: var(--gray-600);
}

/* Mode sombre */
.dark .panel {
  --panel-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2);
  --panel-shadow-hover: 0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
  --panel-shadow-elevated: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
  --panel-border: 1px solid var(--gray-700);
  --panel-bg: var(--gray-800);
  --panel-text: var(--gray-100);
  --panel-text-muted: var(--gray-300);
}

/* Base du panneau */
.panel {
  background: var(--panel-bg);
  border: var(--panel-border);
  border-radius: var(--panel-radius);
  box-shadow: var(--panel-shadow);
  color: var(--panel-text);
  transition: all 0.2s ease-in-out;
  overflow: hidden;
}

/* Variantes de taille */
.panel--small {
  --panel-radius: 0.75rem;
  --panel-padding: 1rem;
}

.panel--medium {
  --panel-radius: 1rem;
  --panel-padding: 1.5rem;
}

.panel--large {
  --panel-radius: 1.25rem;
  --panel-padding: 2rem;
}

/* Effet élevé */
.panel--elevated {
  box-shadow: var(--panel-shadow-elevated);
}

/* Effet verre */
.panel--glass {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .panel--glass {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Panneau interactif */
.panel--interactive {
  cursor: pointer;
  user-select: none;
}

.panel--interactive:hover {
  box-shadow: var(--panel-shadow-hover);
  transform: translateY(-1px);
}

.panel--interactive:active {
  transform: translateY(0);
}

/* Variantes de couleur */
.panel--primary {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: white;
}

.panel--secondary {
  background: var(--secondary-color);
  border-color: var(--primary-light);
}

.panel--success {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border-color: var(--success-color);
  color: var(--gray-800);
}

.panel--warning {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: var(--warning-color);
  color: var(--gray-800);
}

.panel--danger {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-color: var(--danger-color);
  color: var(--gray-800);
}

/* Structure interne */
.panel__header {
  padding: var(--panel-padding) var(--panel-padding) 0;
  border-bottom: 1px solid var(--gray-200);
  margin-bottom: var(--panel-padding);
}

.dark .panel__header {
  border-bottom-color: var(--gray-700);
}

.panel__title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--panel-text);
}

.panel__content {
  padding: var(--panel-padding);
}

.panel__header + .panel__content {
  padding-top: 0;
}

.panel__footer {
  padding: 0 var(--panel-padding) var(--panel-padding);
  border-top: 1px solid var(--gray-200);
  margin-top: var(--panel-padding);
}

.dark .panel__footer {
  border-top-color: var(--gray-700);
}

/* Responsive */
@media (max-width: 640px) {
  .panel--large {
    --panel-padding: 1.5rem;
  }
  
  .panel--medium {
    --panel-padding: 1.25rem;
  }
  
  .panel--small {
    --panel-padding: 1rem;
  }
}

/* Panneau avec couleur personnalisée */
.panel[style*="--panel-accent-color"] {
  border-color: var(--panel-accent-color);
}

.panel[style*="--panel-accent-color"].panel--primary {
  background: linear-gradient(135deg, var(--panel-accent-color) 0%, color-mix(in srgb, var(--panel-accent-color) 80%, black 20%) 100%);
}

/* Force le contraste pour tous les textes en mode sombre */
.dark .panel__title,
.dark .panel__content,
.dark .panel__footer,
.dark .panel__header,
.dark .panel * {
  color: #ffffff !important;
}

/* Surcharger les classes de couleur en mode sombre */
.dark .panel--primary,
.dark .panel--secondary,
.dark .panel--success,
.dark .panel--warning,
.dark .panel--danger {
  color: #ffffff !important;
}

.dark .panel--primary *,
.dark .panel--secondary *,
.dark .panel--success *,
.dark .panel--warning *,
.dark .panel--danger * {
  color: #ffffff !important;
}
</style>


