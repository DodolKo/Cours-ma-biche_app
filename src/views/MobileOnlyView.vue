<template>
  <div class="mobile-only-container">
    <div class="mobile-only-card">
      <!-- Icône mobile -->
      <div class="mobile-icon">
        <svg 
          class="w-16 h-16 text-green-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </div>

      <!-- Titre -->
      <h1 class="mobile-only-title">
        Chronomètre Mobile
      </h1>

      <!-- Message explicatif -->
      <p class="mobile-only-message">
        Le chronomètre est optimisé pour les appareils mobiles. 
        Utilisez votre smartphone pour accéder à cette fonctionnalité.
      </p>

      <!-- Actions alternatives -->
      <div class="mobile-only-actions">
        <RouterLink 
          to="/stats" 
          class="action-button primary"
        >
          <svg 
            class="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          Voir les Statistiques
        </RouterLink>

        <RouterLink 
          to="/profile" 
          class="action-button secondary"
        >
          <svg 
            class="w-5 h-5 mr-2" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Mon Profil
        </RouterLink>
      </div>

      <!-- Conseil PWA -->
      <div class="pwa-tip">
        <div class="tip-icon">
          <svg 
            class="w-6 h-6 text-blue-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div class="tip-content">
          <h3 class="tip-title">Conseil</h3>
          <p class="tip-text">
            Installez l'application sur votre mobile pour une expérience optimale !
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Page d'information pour les utilisateurs desktop/tablette
// qui tentent d'accéder au chronomètre
</script>

<style scoped>
/* Conteneur principal */
.mobile-only-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, var(--white) 0%, var(--secondary-color) 100%);
}

/* Carte principale */
.mobile-only-card {
  max-width: 500px;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Icône mobile */
.mobile-icon {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

/* Titre */
.mobile-only-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--gray-800);
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Message */
.mobile-only-message {
  font-size: 1.125rem;
  color: var(--gray-600);
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

/* Actions */
.mobile-only-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2.5rem;
}

.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 1.5rem;
  border-radius: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.action-button.primary {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  box-shadow: 0 4px 14px 0 rgba(34, 197, 94, 0.3);
}

.action-button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px 0 rgba(34, 197, 94, 0.4);
}

.action-button.secondary {
  background: var(--gray-50);
  color: var(--gray-700);
  border-color: var(--gray-200);
}

.action-button.secondary:hover {
  background: var(--gray-100);
  border-color: var(--gray-300);
  transform: translateY(-1px);
}

/* Conseil PWA */
.pwa-tip {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(59, 130, 246, 0.05);
  border-radius: 16px;
  border: 1px solid rgba(59, 130, 246, 0.1);
}

.tip-icon {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.tip-content {
  text-align: left;
}

.tip-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 0.5rem;
}

.tip-text {
  font-size: 0.875rem;
  color: var(--gray-600);
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 640px) {
  .mobile-only-container {
    padding: 1rem;
  }
  
  .mobile-only-card {
    padding: 2rem 1.5rem;
  }
  
  .mobile-only-title {
    font-size: 1.75rem;
  }
  
  .mobile-only-message {
    font-size: 1rem;
  }
  
  .mobile-only-actions {
    gap: 0.75rem;
  }
  
  .action-button {
    padding: 0.875rem 1.25rem;
  }
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mobile-only-card {
  animation: fadeInUp 0.6s ease-out;
}

/* Accessibilité */
@media (prefers-reduced-motion: reduce) {
  .mobile-only-card {
    animation: none;
  }
  
  .action-button {
    transition: none;
  }
}

/* Focus states */
.action-button:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
</style>
