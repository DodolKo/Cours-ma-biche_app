import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/utils/supabase'
import { logger } from '@/utils/logger'

/**
 * Store pour la gestion des entraînements avec Supabase
 * Gère l'état actuel de l'entraînement, la progression et les programmes
 */
export const useTrainingStore = defineStore('training', () => {
  // État réactif
  const currentProgram = ref(null)
  const userProgress = ref(null)
  const availablePrograms = ref([])
  const loading = ref(false)
  
  // Timer state
  const isRunning = ref(false)
  const currentPhase = ref(0)
  const timeRemaining = ref(0)
  const totalTime = ref(0)
  const phases = ref([])

  // Computed properties
  const currentPhaseData = computed(() => phases.value[currentPhase.value] || null)
  const phasesRemaining = computed(() => phases.value.length - currentPhase.value)
  const progressPercentage = computed(() => {
    if (totalTime.value === 0) return 0
    return ((totalTime.value - timeRemaining.value) / totalTime.value) * 100
  })

  // Actions DB
  const loadPrograms = async () => {
    loading.value = true
    
    try {
      // Essayer de charger depuis Supabase d'abord
      const { data, error } = await supabase
        .from('training_programs')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (!error && data && data.length > 0) {
        logger.log('✅ Programmes chargés depuis Supabase')
        availablePrograms.value = data
      } else {
        logger.log('ℹ️ Aucun programme trouvé en DB, utilisation des programmes par défaut')
        availablePrograms.value = getDefaultPrograms()
      }
    } catch (err) {
      logger.log('ℹ️ Erreur Supabase, utilisation des programmes par défaut:', err)
      availablePrograms.value = getDefaultPrograms()
    } finally {
      loading.value = false
    }
  }

  const startProgram = async (programId) => {
    loading.value = true
    try {
      // Trouver le programme dans la liste
      const program = availablePrograms.value.find(p => p.id === programId)
      if (!program) {
        logger.error('Programme non trouvé:', programId)
        return
      }
      
      currentProgram.value = program

      // Mode statique - stockage local uniquement
      const localProgress = {
        id: 'local-' + Date.now(),
        program_id: programId,
        current_week: 1,
        current_day: 1,
        completed_sessions: [],
        is_active: true,
        created_at: new Date().toISOString()
      }
      
      userProgress.value = localProgress
      saveLocalProgress(localProgress)
      initializeCurrentSession()
      
    } catch (err) {
      logger.error('Erreur démarrage programme:', err)
    } finally {
      loading.value = false
    }
  }

  const loadUserProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_training_progress')
        .select(`
          *,
          training_programs(*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .limit(1)
      
      if (!error && data && data.length > 0) {
        logger.log('✅ Progression chargée depuis Supabase')
        userProgress.value = data[0]
        currentProgram.value = data[0].training_programs
        initializeCurrentSession()
      } else {
        logger.log('ℹ️ Aucune progression trouvée en DB')
      }
    } catch (err) {
      logger.log('ℹ️ Erreur Supabase, pas de progression:', err.message)
    }
  }

  // Timer logic
  const initializeCurrentSession = () => {
    if (!currentProgram.value || !userProgress.value) return

    const weekKey = `week_${userProgress.value.current_week}`
    const dayKey = `day_${userProgress.value.current_day}`
    
    const sessionPhases = currentProgram.value.phases?.[weekKey]?.[dayKey] || []
    phases.value = sessionPhases
    
    // Calculer le temps total en secondes
    totalTime.value = sessionPhases.reduce((total, phase) => total + (phase.duration * 60), 0)
    timeRemaining.value = totalTime.value
    currentPhase.value = 0
    isRunning.value = false
  }

  const startTimer = () => {
    if (phases.value.length === 0) return
    
    logger.log('▶️ Démarrage du timer')
    isRunning.value = true
    runTimer()
  }

  const pauseTimer = () => {
    logger.log('⏸️ Pause du timer')
    isRunning.value = false
    if (timerId) {
      cancelAnimationFrame(timerId)
      timerId = null
    }
  }

  const resetTimer = () => {
    isRunning.value = false
    if (timerId) {
      cancelAnimationFrame(timerId)
      timerId = null
    }
    timeRemaining.value = totalTime.value
    currentPhase.value = 0
    lastUpdateTime = 0
  }

  let timerId = null
  let lastUpdateTime = 0

  const runTimer = (currentTime = 0) => {
    // Vérifier d'abord si le timer doit s'arrêter
    if (!isRunning.value) {
      if (timerId) {
        cancelAnimationFrame(timerId)
        timerId = null
      }
      return
    }

    if (timeRemaining.value <= 0) {
      // Phase terminée, passer à la suivante automatiquement
      if (currentPhase.value < phases.value.length - 1) {
        logger.log(`✅ Phase ${currentPhase.value + 1} terminée, passage à la suivante...`)
        currentPhase.value++
        
        // Recalculer le temps pour la nouvelle phase
        const newPhaseTime = phases.value[currentPhase.value]?.duration * 60 || 0
        timeRemaining.value = newPhaseTime
        totalTime.value = newPhaseTime
        
        logger.log(`▶️ Nouvelle phase: ${phases.value[currentPhase.value]?.name} (${newPhaseTime}s)`)
        lastUpdateTime = currentTime
      } else {
        // Toutes les phases terminées
        logger.log('🎉 Toutes les phases terminées!')
        completeSession()
        return
      }
    }

    // Utiliser requestAnimationFrame pour une meilleure performance
    if (currentTime - lastUpdateTime >= 1000) { // Mettre à jour toutes les secondes
      timeRemaining.value--
      lastUpdateTime = currentTime
    }

    // Continuer le timer seulement si isRunning est toujours true
    if (isRunning.value) {
      timerId = requestAnimationFrame(runTimer)
    }
  }

  const completeSession = async () => {
    logger.log('🎉 Session complète terminée!')
    isRunning.value = false
    
    if (!userProgress.value) return

    const session = {
      week: userProgress.value.current_week,
      day: userProgress.value.current_day,
      completed_at: new Date().toISOString(),
      duration: totalTime.value,
      phases_completed: phases.value.length
    }

    const sessions = [...(userProgress.value.completed_sessions || []), session]
    
    try {
      // Essayer de sauvegarder en DB d'abord
      const { data: { user } } = await supabase.auth.getUser()
      if (user && !userProgress.value.id.startsWith('local-')) {
        try {
          const { error } = await supabase
            .from('user_training_progress')
            .update({
              current_day: userProgress.value.current_day + 1,
              completed_sessions: sessions,
              updated_at: new Date().toISOString()
            })
            .eq('id', userProgress.value.id)
          
          if (!error) {
            // Recharger la progression
            await loadUserProgress()
            return
          }
        } catch (dbErr) {
          logger.warn('Erreur DB, utilisation du stockage local:', dbErr)
        }
      }

      // Fallback: mise à jour locale
      const updatedProgress = {
        ...userProgress.value,
        current_day: userProgress.value.current_day + 1,
        completed_sessions: sessions,
        updated_at: new Date().toISOString()
      }
      
      userProgress.value = updatedProgress
      saveLocalProgress(updatedProgress)
      
    } catch (err) {
      logger.error('Erreur completion session:', err)
    }
    
    logger.log('✅ Session complète sauvegardée:', session)
  }

  // Formatage du temps
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Programmes par défaut (fallback)
  const getDefaultPrograms = () => {
    return [
      {
        id: 'default-beginner',
        name: 'Débuter la course - 4 semaines',
        description: 'Programme progressif pour débuter la course à pied',
        total_weeks: 4,
        phases: {
          week_1: {
            day_1: [
              { type: 'warmup', duration: 5, description: 'Échauffement léger' },
              { type: 'walk', duration: 10, description: 'Marche modérée' },
              { type: 'stretch', duration: 5, description: 'Étirements' }
            ],
            day_2: [
              { type: 'warmup', duration: 5, description: 'Échauffement' },
              { type: 'walk', duration: 8, description: 'Marche rapide' },
              { type: 'run', duration: 2, description: 'Course légère - 2 min' },
              { type: 'stretch', duration: 5, description: 'Étirements' }
            ]
          }
        }
      },
      {
        id: 'default-intermediate',
        name: 'Course intermédiaire - 6 semaines',
        description: 'Programme pour coureurs ayant une base',
        total_weeks: 6,
        phases: {
          week_1: {
            day_1: [
              { type: 'warmup', duration: 5, description: 'Échauffement dynamique' },
              { type: 'run', duration: 20, description: 'Course continue - 20 min' },
              { type: 'stretch', duration: 10, description: 'Étirements complets' }
            ]
          }
        }
      }
    ]
  }

  // Charger la progression depuis localStorage
  const loadLocalProgress = () => {
    try {
      const saved = localStorage.getItem('training_progress')
      if (saved) {
        const progress = JSON.parse(saved)
        userProgress.value = progress
        // Trouver le programme correspondant
        const program = availablePrograms.value.find(p => p.id === progress.program_id)
        if (program) {
          currentProgram.value = program
          initializeCurrentSession()
        }
      }
    } catch (err) {
      logger.warn('Erreur chargement progression locale:', err)
    }
  }

  // Sauvegarder la progression en local
  const saveLocalProgress = (progress) => {
    try {
      localStorage.setItem('training_progress', JSON.stringify(progress))
    } catch (err) {
      logger.warn('Erreur sauvegarde progression locale:', err)
    }
  }

  // Reset complet
  const resetProgress = () => {
    currentProgram.value = null
    userProgress.value = null
    isRunning.value = false
    currentPhase.value = 0
    timeRemaining.value = 0
    totalTime.value = 0
    phases.value = []
    // Nettoyer le localStorage
    localStorage.removeItem('training_progress')
  }

  // Computed pour compatibilité avec l'ancien système
  const currentProgramData = computed(() => {
    if (!currentProgram.value) return null
    
    // Si on a une progression utilisateur, utiliser les phases de la progression
    if (userProgress.value) {
      const weekKey = `week_${userProgress.value.current_week}`
      const dayKey = `day_${userProgress.value.current_day}`
      const sessionPhases = currentProgram.value.phases?.[weekKey]?.[dayKey] || []
      
      return {
        name: currentProgram.value.name,
        phases: sessionPhases.map(phase => ({
          name: getPhaseLabel(phase.type),
          duration: phase.duration * 60, // Convertir en secondes
          type: phase.type,
          description: phase.description
        }))
      }
    }
    
    // Sinon, utiliser les phases par défaut du programme
    const defaultPhases = currentProgram.value.phases?.week_1?.day_1 || []
    
    return {
      name: currentProgram.value.name,
      phases: defaultPhases.map(phase => ({
        name: getPhaseLabel(phase.type),
        duration: phase.duration * 60, // Convertir en secondes
        type: phase.type,
        description: phase.description
      }))
    }
  })

  const currentWeek = computed(() => userProgress.value?.current_week || 1)
  const currentDay = computed(() => userProgress.value?.current_day || 1)

  const getTrainingStats = () => {
    return {
      completedSessions: userProgress.value?.completed_sessions?.length || 0,
      totalTime: userProgress.value?.completed_sessions?.reduce((sum, session) => sum + session.duration, 0) || 0,
      currentStreak: 0 // À implémenter si nécessaire
    }
  }

  const completeTraining = () => {
    completeSession()
  }

  const initializeTraining = () => {
    loadUserProgress()
  }

  const getPhaseLabel = (type) => {
    const labels = {
      warmup: 'Échauffement',
      walk: 'Marche',
      run: 'Course',
      stretch: 'Étirements'
    }
    return labels[type] || type
  }

  return {
    // État
    currentProgram,
    userProgress,
    availablePrograms,
    loading,
    isRunning,
    currentPhase,
    timeRemaining,
    totalTime,
    phases,
    
    // Computed
    currentPhaseData,
    phasesRemaining,
    progressPercentage,
    currentWeek,
    currentDay,
    
    // Actions
    loadPrograms,
    startProgram,
    loadUserProgress,
    startTimer,
    pauseTimer,
    resetTimer,
    completeSession,
    formatTime,
    resetProgress,
    loadLocalProgress,
    saveLocalProgress,
    
    // Compatibilité avec l'ancien système
    getTrainingStats,
    completeTraining,
    initializeTraining
  }
})




