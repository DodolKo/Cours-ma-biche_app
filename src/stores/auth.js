import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../utils/supabase'

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
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      user.value = currentUser
    } catch (err) {
      console.error('Erreur lors de l\'initialisation de l\'auth:', err)
    }
  }

  // Écouter les changements d'état d'authentification
  function setupAuthListener() {
    supabase.auth.onAuthStateChange((event, session) => {
      user.value = session?.user || null
      
      if (event === 'SIGNED_OUT') {
        error.value = null
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
