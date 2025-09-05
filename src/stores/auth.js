import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../utils/supabase'
import { logger } from '../utils/logger'

/**
 * Store d'authentification simple
 * Email + Password + Username seulement
 */
export const useAuthStore = defineStore('auth', () => {
  // État réactif
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters simples
  const isAuthenticated = computed(() => !!user.value)
  const userEmail = computed(() => user.value?.email || null)
  const userName = computed(() => user.value?.user_metadata?.username || user.value?.email?.split('@')[0] || '')
  const userFullName = computed(() => user.value?.user_metadata?.full_name || userName.value)

  // Actions simples
  async function signUp(email, password, username = '') {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
            full_name: username || email.split('@')[0]
          }
        }
      })
      
      if (signUpError) throw signUpError
      
      // L'utilisateur doit confirmer son email
      if (data.user && !data.user.email_confirmed_at) {
        return {
          success: true,
          message: 'Vérifiez votre email pour confirmer votre inscription'
        }
      }
      
      user.value = data.user
      return { success: true, message: 'Inscription réussie' }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function signIn(email, password) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (signInError) throw signInError
      
      user.value = data.user
      return { success: true, message: 'Connexion réussie' }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    loading.value = true
    error.value = null
    
    try {
      const { error: signOutError } = await supabase.auth.signOut()
      
      if (signOutError) throw signOutError
      
      user.value = null
      return { success: true, message: 'Déconnexion réussie' }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Initialiser l'état utilisateur au démarrage
  async function initialize() {
    loading.value = true
    
    try {
      // Récupérer la session actuelle (inclut le token de rafraîchissement)
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        logger.error('Erreur lors de la récupération de la session:', error)
        return
      }
      
      // Définir l'utilisateur si une session existe
      if (session?.user) {
        user.value = session.user
        logger.log('✅ Session utilisateur restaurée:', session.user.email)
      } else {
        logger.log('ℹ️ Aucune session active trouvée')
      }
    } catch (err) {
      logger.error('Erreur lors de l\'initialisation de l\'auth:', err)
    } finally {
      loading.value = false
    }
  }

  // Écouter les changements d'état d'authentification
  function setupAuthListener() {
    supabase.auth.onAuthStateChange((event, session) => {
      logger.log('🔄 Événement d\'authentification:', event, session?.user?.email || 'Aucun utilisateur')
      
      user.value = session?.user || null
      
      if (event === 'SIGNED_IN') {
        logger.log('✅ Utilisateur connecté:', session.user.email)
        error.value = null
      } else if (event === 'SIGNED_OUT') {
        logger.log('👋 Utilisateur déconnecté')
        error.value = null
      } else if (event === 'TOKEN_REFRESHED') {
        logger.log('🔄 Token rafraîchi pour:', session.user.email)
      }
    })
  }

  // Fonction simple pour mettre à jour le nom d'utilisateur
  async function updateUsername(newUsername) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        data: {
          username: newUsername,
          full_name: newUsername
        }
      })
      
      if (updateError) throw updateError
      
      user.value = data.user
      return { success: true, message: 'Nom d\'utilisateur mis à jour' }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  return {
    // État
    user,
    loading,
    error,
    // Getters simples
    isAuthenticated,
    userEmail,
    userName,
    userFullName,
    // Actions simples
    signUp,
    signIn,
    signOut,
    updateUsername,
    initialize,
    setupAuthListener
  }
})
