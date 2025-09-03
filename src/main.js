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

// Initialiser l'authentification après le montage de Pinia
const authStore = useAuthStore()
authStore.initialize()
authStore.setupAuthListener()

app.mount('#app')
