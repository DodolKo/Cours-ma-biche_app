<template>
  <AppLayout>
    <!-- Program View - Page principale avec chronomètres -->
    <div class="program-view page-content">
      

      <!-- Loading state -->
      <div v-if="loading" class="text-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p class="text-gray-600 dark:text-gray-400 mt-4">Chargement des programmes...</p>
      </div>

      <!-- Programme condensé avec chronomètre -->
      <div v-else class="program-container">
        <div class="program-card-condensed">
          <!-- Header du programme condensé -->
          <div class="program-header-condensed">
            <div class="program-title-section">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {{ currentProgram?.name || 'Programme d\'entraînement' }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {{ currentProgram?.description || 'Prêt à commencer votre session' }}
              </p>
            </div>
            
            <!-- Informations du programme -->
            <div class="program-info-condensed">
              <div class="info-item">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ currentProgram ? formatDuration(getTotalDuration(currentProgram)) : '0min' }}
                </span>
              </div>
              <div class="info-item">
                <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ currentProgram?.total_weeks || 0 }} semaines
                </span>
              </div>
            </div>
          </div>

          <!-- Chronomètre du programme -->
          <div class="timer-container-condensed">
            <Timer
              v-if="currentProgram"
              :program="getProgramData(currentProgram)"
              :current-week="1"
              :current-day="1"
              @session-completed="handleSessionCompleted"
              :key="currentProgram.id"
            />
            <div v-else class="no-program-placeholder">
              <div class="text-center py-12">
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Aucun programme disponible
                </h3>
                <p class="text-gray-600 dark:text-gray-400">
                  Les programmes d'entraînement seront bientôt disponibles.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Message si aucun programme -->
        <div v-if="availablePrograms.length === 0" class="text-center py-8">
          <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Aucun programme disponible
          </h3>
          <p class="text-gray-600 dark:text-gray-400">
            Les programmes d'entraînement seront bientôt disponibles.
          </p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTrainingStore } from '@/stores/training'
import { isMobile as checkIsMobile } from '@/utils/deviceDetection'
import AppLayout from '@/components/layout/AppLayout.vue'
import Timer from '@/components/Timer.vue'

const trainingStore = useTrainingStore()

// Computed pour la détection mobile
const isMobile = computed(() => checkIsMobile())

// Computed pour les programmes disponibles
const availablePrograms = computed(() => trainingStore.availablePrograms)
const loading = computed(() => trainingStore.loading)

// Programme actuel (premier disponible)
const currentProgram = computed(() => {
  return availablePrograms.value.length > 0 ? availablePrograms.value[0] : null
})

// Méthodes
const getProgramData = (program) => {
  // Convertir le programme de la DB en format attendu par le Timer
  const weekKey = 'week_1'
  const dayKey = 'day_1'
  const sessionPhases = program.phases?.[weekKey]?.[dayKey] || []
  
  return {
    name: program.name,
    phases: sessionPhases.map(phase => ({
      name: getPhaseLabel(phase.type),
      duration: phase.duration * 60, // Convertir en secondes
      type: phase.type,
      description: phase.description
    }))
  }
}

const getTotalDuration = (program) => {
  const weekKey = 'week_1'
  const dayKey = 'day_1'
  const sessionPhases = program.phases?.[weekKey]?.[dayKey] || []
  
  const totalMinutes = sessionPhases.reduce((total, phase) => total + phase.duration, 0)
  return totalMinutes
}

const formatDuration = (minutes) => {
  if (minutes < 60) {
    return `${minutes}min`
  } else {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`
  }
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

const handleSessionCompleted = (sessionData) => {
  console.log('Session terminée:', sessionData)
  // Ici vous pouvez ajouter d'autres actions après la fin d'une session
}

onMounted(async () => {
  // Charger les programmes disponibles
  await trainingStore.loadPrograms()
})
</script>

<style scoped>
.program-view {
  min-height: 100vh;
  padding: 2rem 1rem;
}

.program-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

.program-card-condensed {
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.program-card-condensed:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15);
}

.program-header-condensed {
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e5e7eb;
}

.program-title-section {
  margin-bottom: 1.5rem;
}

.program-info-condensed {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
}


.timer-container-condensed {
  padding: 0;
  background: white;
}

.no-program-placeholder {
  padding: 2rem;
  background: #f9fafb;
}

/* Responsive design */
@media (max-width: 640px) {
  .program-container {
    padding: 0 0.5rem;
  }
  
  .program-header-condensed {
    padding: 1.5rem;
  }
  
  .program-info-condensed {
    gap: 1rem;
  }
  
  .info-item {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
  
}

/* Dark mode */
.dark .program-card-condensed {
  background: #1f2937;
  border-color: #374151;
}

.dark .program-header-condensed {
  background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
  border-color: #374151;
}


.dark .timer-container-condensed {
  background: #1f2937;
}

.dark .no-program-placeholder {
  background: #111827;
}

.dark .info-item {
  background: rgba(31, 41, 55, 0.8);
  border-color: rgba(55, 65, 81, 0.3);
}
</style>
