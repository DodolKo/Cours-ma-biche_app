import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'

import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Initialiser l'authentification après le montage de Pinia
const authStore = useAuthStore()
authStore.initialize()
authStore.setupAuthListener()

app.mount('#app')
