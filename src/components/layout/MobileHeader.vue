<template>
  <!-- Header mobile en haut d'écran - Visible uniquement sur mobile -->
  <header 
    class="mobile-header"
    role="banner"
    aria-label="En-tête mobile"
  >
    <div class="mobile-header-content">
      <!-- Logo à gauche -->
      <div class="mobile-header-logo">
        <img 
          src="/logo - app -192.png" 
          alt="Running App Logo" 
          class="w-8 h-8 object-contain"
        />
      </div>
      
      <!-- Titre de l'application -->
      <div class="mobile-header-title">
        <h1 class="text-lg font-semibold text-white">
          Running App
        </h1>
      </div>
      
      <!-- Actions (toggle de thème, etc.) -->
      <div class="mobile-header-actions">
        <ThemeToggle class="compact" />
      </div>
    </div>
  </header>
</template>

<script setup>
import AppLogo from '@/components/ui/AppLogo.vue'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
</script>

<style scoped>
.mobile-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1rem;
  z-index: 40;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  /* Masquer sur desktop */
  display: none;
  /* Arrondis sur les angles inférieurs */
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
}

/* Mode sombre pour le header mobile */
.dark .mobile-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  border-bottom-color: rgba(255, 255, 255, 0.2);
}

/* Responsive padding */
@media (max-width: 480px) {
  .mobile-header {
    padding: 0.5rem 0.75rem;
  }
  
  .mobile-header-title h1 {
    font-size: 1rem;
  }
}

.mobile-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 100%;
}

.mobile-header-logo {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.mobile-header-title {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 1rem;
}

.mobile-header-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  min-width: 2rem; /* Espace réservé pour les actions futures */
}

/* Afficher uniquement sur mobile */
@media (max-width: 640px) {
  .mobile-header {
    display: block;
  }
}

/* Header toujours vert - pas de changement selon le thème */
</style>
