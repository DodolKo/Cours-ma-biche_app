<template>
  <div v-if="showInstallPrompt" class="pwa-install-prompt">
    <div class="install-card">
      <!-- Icône de l'app -->
      <div class="app-icon">
        <img src="/logo-192.png" alt="Running App" class="w-12 h-12" />
      </div>
      
      <!-- Contenu -->
      <div class="install-content">
        <h3 class="install-title">Installer Running App</h3>
        <p class="install-description">
          Installez l'application pour un accès rapide et une expérience optimale
        </p>
      </div>
      
      <!-- Actions -->
      <div class="install-actions">
        <button 
          @click="installPWA" 
          class="install-button primary"
          :disabled="isInstalling"
        >
          <svg v-if="isInstalling" class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          {{ isInstalling ? 'Installation...' : 'Installer' }}
        </button>
        
        <button 
          @click="dismissInstall" 
          class="install-button secondary"
        >
          Plus tard
        </button>
      </div>
      
      <!-- Fermer -->
      <button 
        @click="dismissInstall" 
        class="close-button"
        aria-label="Fermer"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// État réactif
const showInstallPrompt = ref(false)
const isInstalling = ref(false)
const deferredPrompt = ref(null)

/**
 * Gestionnaire d'événement pour l'installation PWA
 */
function handleBeforeInstallPrompt(event) {
  // Empêcher l'affichage automatique du prompt
  event.preventDefault()
  
  // Stocker l'événement pour l'utiliser plus tard
  deferredPrompt.value = event
  
  // Vérifier si l'utilisateur a déjà refusé l'installation
  const installDismissed = localStorage.getItem('pwa-install-dismissed')
  const installDismissedDate = localStorage.getItem('pwa-install-dismissed-date')
  
  // Si refusé il y a moins de 7 jours, ne pas afficher
  if (installDismissed && installDismissedDate) {
    const daysSinceDismissed = (Date.now() - parseInt(installDismissedDate)) / (1000 * 60 * 60 * 24)
    if (daysSinceDismissed < 7) {
      return
    }
  }
  
  // Afficher le prompt personnalisé
  showInstallPrompt.value = true
}

/**
 * Installation de la PWA
 */
async function installPWA() {
  if (!deferredPrompt.value) return
  
  isInstalling.value = true
  
  try {
    // Afficher le prompt d'installation
    deferredPrompt.value.prompt()
    
    // Attendre la réponse de l'utilisateur
    const { outcome } = await deferredPrompt.value.userChoice
    
    if (outcome === 'accepted') {
      console.log('PWA installée avec succès')
      // Supprimer le prompt
      showInstallPrompt.value = false
      deferredPrompt.value = null
    } else {
      console.log('Installation PWA refusée')
      // Marquer comme refusé
      localStorage.setItem('pwa-install-dismissed', 'true')
      localStorage.setItem('pwa-install-dismissed-date', Date.now().toString())
    }
  } catch (error) {
    console.error('Erreur lors de l\'installation PWA:', error)
  } finally {
    isInstalling.value = false
  }
}

/**
 * Masquer le prompt d'installation
 */
function dismissInstall() {
  showInstallPrompt.value = false
  
  // Marquer comme refusé pour 7 jours
  localStorage.setItem('pwa-install-dismissed', 'true')
  localStorage.setItem('pwa-install-dismissed-date', Date.now().toString())
}

/**
 * Gestionnaire pour l'installation réussie
 */
function handleAppInstalled() {
  console.log('PWA installée')
  showInstallPrompt.value = false
  deferredPrompt.value = null
}

// Lifecycle hooks
onMounted(() => {
  // Écouter les événements PWA
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.addEventListener('appinstalled', handleAppInstalled)
})

onUnmounted(() => {
  // Nettoyer les événements
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  window.removeEventListener('appinstalled', handleAppInstalled)
})
</script>

<style scoped>
/* Conteneur principal */
.pwa-install-prompt {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  z-index: 1000;
  max-width: 400px;
  margin: 0 auto;
}

/* Carte d'installation */
.install-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  animation: slideInUp 0.3s ease-out;
}

/* Icône de l'app */
.app-icon {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
}

/* Contenu */
.install-content {
  margin-left: 4rem;
  margin-bottom: 1rem;
}

.install-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--gray-800);
  margin-bottom: 0.25rem;
}

.install-description {
  font-size: 0.875rem;
  color: var(--gray-600);
  line-height: 1.4;
}

/* Actions */
.install-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.install-button {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.install-button.primary {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  box-shadow: 0 4px 14px 0 rgba(34, 197, 94, 0.3);
}

.install-button.primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px 0 rgba(34, 197, 94, 0.4);
}

.install-button.primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.install-button.secondary {
  background: var(--gray-50);
  color: var(--gray-700);
  border-color: var(--gray-200);
}

.install-button.secondary:hover {
  background: var(--gray-100);
  border-color: var(--gray-300);
}

/* Bouton fermer */
.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem;
  color: var(--gray-400);
  transition: color 0.2s ease;
  border-radius: 8px;
}

.close-button:hover {
  color: var(--gray-600);
  background: var(--gray-100);
}

/* Animations */
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .pwa-install-prompt {
    bottom: max(1rem, env(safe-area-inset-bottom, 1rem));
    left: 1rem;
    right: 1rem;
  }
  
  .install-card {
    padding: 1.25rem;
  }
  
  .install-content {
    margin-left: 3.5rem;
  }
  
  .install-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .install-button {
    padding: 0.875rem 1rem;
  }
}

/* Accessibilité */
@media (prefers-reduced-motion: reduce) {
  .install-card {
    animation: none;
  }
  
  .install-button {
    transition: none;
  }
}

/* Focus states */
.install-button:focus,
.close-button:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
</style>