import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getTrainingProgram, getAllPrograms } from '@/data/trainingPrograms'

/**
 * Store pour la gestion des entraînements
 * Gère l'état actuel de l'entraînement, la progression et les programmes
 */
export const useTrainingStore = defineStore('training', () => {
  // État réactif
  const currentWeek = ref(1)
  const currentDay = ref(1)
  const isTrainingActive = ref(false)
  const currentProgram = ref(null)
  const trainingHistory = ref([])
  const userProgress = ref({
    completedSessions: 0,
    totalTime: 0,
    currentStreak: 0
  })

  // Computed properties
  const availablePrograms = computed(() => getAllPrograms())
  
  const currentProgramData = computed(() => {
    if (!currentProgram.value) {
      return getTrainingProgram(currentWeek.value, currentDay.value)
    }
    return currentProgram.value
  })

  const programInfo = computed(() => ({
    week: currentWeek.value,
    day: currentDay.value,
    program: currentProgramData.value,
    isActive: isTrainingActive.value
  }))

  // Actions
  const setCurrentWeek = (week) => {
    if (week >= 1 && week <= 8) {
      currentWeek.value = week
      loadCurrentProgram()
    }
  }

  const setCurrentDay = (day) => {
    if (day >= 1 && day <= 7) {
      currentDay.value = day
      loadCurrentProgram()
    }
  }

  const loadCurrentProgram = () => {
    currentProgram.value = getTrainingProgram(currentWeek.value, currentDay.value)
  }

  const startTraining = () => {
    isTrainingActive.value = true
    loadCurrentProgram()
  }

  const pauseTraining = () => {
    isTrainingActive.value = false
  }

  const completeTraining = () => {
    isTrainingActive.value = false
    
    // Enregistrer la session dans l'historique
    const session = {
      id: Date.now(),
      week: currentWeek.value,
      day: currentDay.value,
      program: currentProgramData.value,
      completedAt: new Date().toISOString(),
      duration: currentProgramData.value.totalDuration
    }
    
    trainingHistory.value.unshift(session)
    
    // Mettre à jour les statistiques
    userProgress.value.completedSessions++
    userProgress.value.totalTime += session.duration
    userProgress.value.currentStreak++
    
    // Passer au jour suivant
    nextDay()
  }

  const nextDay = () => {
    if (currentDay.value < 7) {
      currentDay.value++
    } else {
      // Passer à la semaine suivante
      currentWeek.value++
      currentDay.value = 1
    }
    loadCurrentProgram()
  }

  const previousDay = () => {
    if (currentDay.value > 1) {
      currentDay.value--
    } else if (currentWeek.value > 1) {
      // Revenir à la semaine précédente
      currentWeek.value--
      currentDay.value = 7
    }
    loadCurrentProgram()
  }

  const resetProgress = () => {
    currentWeek.value = 1
    currentDay.value = 1
    isTrainingActive.value = false
    trainingHistory.value = []
    userProgress.value = {
      completedSessions: 0,
      totalTime: 0,
      currentStreak: 0
    }
    loadCurrentProgram()
  }

  const getTrainingStats = () => {
    return {
      ...userProgress.value,
      totalSessions: trainingHistory.value.length,
      averageSessionTime: userProgress.value.completedSessions > 0 
        ? Math.round(userProgress.value.totalTime / userProgress.value.completedSessions)
        : 0,
      lastSession: trainingHistory.value[0] || null
    }
  }

  // Initialisation
  const initializeTraining = () => {
    loadCurrentProgram()
  }

  return {
    // État
    currentWeek,
    currentDay,
    isTrainingActive,
    currentProgram,
    trainingHistory,
    userProgress,
    
    // Computed
    availablePrograms,
    currentProgramData,
    programInfo,
    
    // Actions
    setCurrentWeek,
    setCurrentDay,
    loadCurrentProgram,
    startTraining,
    pauseTraining,
    completeTraining,
    nextDay,
    previousDay,
    resetProgress,
    getTrainingStats,
    initializeTraining
  }
})

