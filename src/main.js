import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import { useAuthStore } from './stores/auth'

import './style.css'
import App from './App.vue'

// Création de l'application Vue
const app = createApp(App)
const pinia = createPinia()

// Configuration des plugins
app.use(pinia)
app.use(router)

// Initialiser l'authentification AVANT le montage de l'app
const authStore = useAuthStore()

// Initialiser l'auth de manière asynchrone et monter l'app une fois terminé
async function initializeApp() {
  try {
    // Initialiser l'authentification
    await authStore.initialize()
    authStore.setupAuthListener()
    
    // Monter l'application une fois l'auth initialisée
    app.mount('#app')
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error)
    // Monter quand même l'app en cas d'erreur
    app.mount('#app')
  }
}

// Lancer l'initialisation
initializeApp()
