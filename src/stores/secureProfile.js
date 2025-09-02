import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../utils/supabase'

export const useSecureProfileStore = defineStore('secureProfile', () => {
  // État réactif pour les données SENSIBLES uniquement
  const sensitiveData = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const hasSensitiveData = computed(() => !!sensitiveData.value)

  // Actions pour les données SENSIBLES (poids, taille, date de naissance, etc.)
  async function fetchSensitiveData(userId) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: fetchError } = await supabase
        .from('user_health_data')
        .select('*')
        .eq('user_id', userId)
        .single()
      
      if (fetchError) {
        // Si pas de données, ce n'est pas une erreur
        if (fetchError.code === 'PGRST116') {
          sensitiveData.value = null
          return { success: true, data: null }
        }
        throw fetchError
      }
      
      sensitiveData.value = data
      return { success: true, data }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function updateSensitiveData(userId, updates) {
    loading.value = true
    error.value = null
    
    try {
      const { data, error: updateError } = await supabase
        .from('user_health_data')
        .upsert({
          user_id: userId,
          birth_date: updates.birth_date || null,
          weight: updates.weight || null,
          height: updates.height || null,
          gender: updates.gender || null,
          activity_level: updates.activity_level || null,
          medical_conditions: updates.medical_conditions || [],
          // Chiffrement côté client pour les données ultra-sensibles
          encrypted_notes: updates.encrypted_notes || null
        })
        .select()
        .single()
      
      if (updateError) throw updateError
      
      sensitiveData.value = data
      return { success: true, message: 'Données de santé mises à jour' }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      loading.value = false
    }
  }

  // Calculer l'âge de manière sécurisée
  const age = computed(() => {
    if (!sensitiveData.value?.birth_date) return null
    const birthDate = new Date(sensitiveData.value.birth_date)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  })

  // Calculer l'IMC de manière sécurisée
  const bmi = computed(() => {
    if (!sensitiveData.value?.weight || !sensitiveData.value?.height) return null
    const heightInM = sensitiveData.value.height / 100
    return (sensitiveData.value.weight / (heightInM * heightInM)).toFixed(1)
  })

  const bmiCategory = computed(() => {
    if (!bmi.value) return null
    const bmiNum = parseFloat(bmi.value)
    
    if (bmiNum < 18.5) return 'Insuffisant'
    if (bmiNum < 25) return 'Normal'
    if (bmiNum < 30) return 'Surpoids'
    return 'Obésité'
  })

  function clearSensitiveData() {
    sensitiveData.value = null
    error.value = null
  }

  return {
    // État
    sensitiveData,
    loading,
    error,
    // Getters
    hasSensitiveData,
    age,
    bmi,
    bmiCategory,
    // Actions
    fetchSensitiveData,
    updateSensitiveData,
    clearSensitiveData
  }
})
