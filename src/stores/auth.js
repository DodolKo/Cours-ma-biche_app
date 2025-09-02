import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../utils/supabase'

export const useAuthStore = defineStore('auth', () => {
  // État réactif
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userEmail = computed(() => user.value?.email || null)

  // Actions
  async function signUp(email, password) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
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

  return {
    // État
    user,
    loading,
    error,
    // Getters
    isAuthenticated,
    userEmail,
    // Actions
    signUp,
    signIn,
    signOut,
    initialize,
    setupAuthListener
  }
})
