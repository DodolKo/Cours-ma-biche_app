import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../utils/supabase'

export const useProfileStore = defineStore('profile', () => {
  // État réactif
  const profile = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const hasProfile = computed(() => !!profile.value)
  const fullName = computed(() => {
    if (!profile.value) return ''
    return `${profile.value.first_name} ${profile.value.last_name}`.trim()
  })
  const isProfileComplete = computed(() => {
    return profile.value?.first_name && profile.value?.last_name
  })

  // Actions
  async function fetchProfile(userId) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      
      if (fetchError) {
        // Si le profil n'existe pas, ce n'est pas une erreur critique
        if (fetchError.code === 'PGRST116') {
          profile.value = null
          return { success: true, profile: null }
        }
        throw fetchError
      }
      
      profile.value = data
      return { success: true, profile: data }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function createProfile(userId, profileData) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: createError } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          email: profileData.email,
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          birth_date: profileData.birth_date || null,
          weight: profileData.weight || null,
          height: profileData.height || null,
          gender: profileData.gender || null,
          activity_level: profileData.activity_level || null,
          running_goals: profileData.running_goals || []
        }])
        .select()
        .single()
      
      if (createError) throw createError
      
      profile.value = data
      return { success: true, message: 'Profil créé avec succès' }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function updateProfile(userId, updates) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()
      
      if (updateError) throw updateError
      
      profile.value = data
      return { success: true, message: 'Profil mis à jour avec succès' }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function upsertProfile(userId, profileData) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: profileData.email,
          first_name: profileData.first_name || '',
          last_name: profileData.last_name || '',
          birth_date: profileData.birth_date || null,
          weight: profileData.weight || null,
          height: profileData.height || null,
          gender: profileData.gender || null,
          activity_level: profileData.activity_level || null,
          running_goals: profileData.running_goals || []
        })
        .select()
        .single()
      
      if (upsertError) throw upsertError
      
      profile.value = data
      return { success: true, message: 'Profil sauvegardé avec succès' }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Calculer l'âge à partir de la date de naissance
  const age = computed(() => {
    if (!profile.value?.birth_date) return null
    const birthDate = new Date(profile.value.birth_date)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  })

  // Calculer l'IMC
  const bmi = computed(() => {
    if (!profile.value?.weight || !profile.value?.height) return null
    const heightInM = profile.value.height / 100
    return (profile.value.weight / (heightInM * heightInM)).toFixed(1)
  })

  function clearProfile() {
    profile.value = null
    error.value = null
  }

  return {
    // État
    profile,
    loading,
    error,
    // Getters
    hasProfile,
    fullName,
    isProfileComplete,
    age,
    bmi,
    // Actions
    fetchProfile,
    createProfile,
    updateProfile,
    upsertProfile,
    clearProfile
  }
})
