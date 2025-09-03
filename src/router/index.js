import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { isMobile } from '@/utils/deviceDetection'

// Import des vues
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import MobileOnlyView from '@/views/MobileOnlyView.vue'

/**
 * Configuration des routes de l'application
 */
const routes = [
  {
    path: '/',
    redirect: () => {
      // Redirection intelligente basée sur le type d'appareil
      return isMobile() ? '/dashboard' : '/stats'
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      requiresGuest: true, // Seuls les utilisateurs non connectés peuvent accéder
      title: 'Connexion - Running App'
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: {
      requiresAuth: true, // Nécessite une authentification
      title: 'Chronomètre - Running App',
      mobileOnly: true // Accessible uniquement sur mobile
    }
  },
  {
    path: '/stats',
    name: 'Stats',
    component: () => import('@/views/StatsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Statistiques - Running App'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Profil - Running App'
    }
  },
  {
    path: '/goals',
    name: 'Goals',
    component: () => import('@/views/GoalsView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Objectifs - Running App'
    }
  },
  {
    path: '/mobile-only',
    name: 'MobileOnly',
    component: MobileOnlyView,
    meta: {
      requiresAuth: true,
      title: 'Application Mobile - Running App'
    }
  }
]

/**
 * Création du router avec l'historique web
 */
const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * Garde de navigation globale - Gestion de l'authentification et des restrictions d'appareil
 */
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Mise à jour du titre de la page
  if (to.meta.title) {
    document.title = to.meta.title
  }
  
  // Attendre que l'authentification soit initialisée si nécessaire
  if (authStore.loading) {
    // Attendre un court délai pour que l'auth se stabilise
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  
  // Vérification de l'authentification
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.meta.requiresAuth
  const requiresGuest = to.meta.requiresGuest
  const mobileOnly = to.meta.mobileOnly
  
  // Vérification des restrictions d'appareil
  if (mobileOnly && !isMobile()) {
    // Route mobile uniquement mais accès depuis desktop/tablette -> page d'information
    next('/mobile-only')
    return
  }
  
  if (requiresAuth && !isAuthenticated) {
    // Route protégée mais utilisateur non connecté -> redirection login
    next('/login')
  } else if (requiresGuest && isAuthenticated) {
    // Page pour invités mais utilisateur connecté -> redirection dashboard (si mobile) ou stats
    if (isMobile()) {
      next('/dashboard')
    } else {
      next('/stats')
    }
  } else {
    // Autoriser la navigation
    next()
  }
})

export default router
