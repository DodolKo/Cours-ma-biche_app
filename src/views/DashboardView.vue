<template>
  <!-- Dashboard View - Design moderne avec navigation responsive -->
  <AppLayout>
    <!-- Contenu principal - Programme avec statistiques intégrées -->
    <div class="dashboard-content page-content">
      
      <!-- Program Component - Centre de l'expérience -->
      <div class="timer-section">
        <!-- Affichage conditionnel basé sur la disponibilité du programme -->
        <div v-if="!trainingStore.currentProgramData" class="no-program-state">
          <div class="text-center py-12">
            <div class="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Aucun programme chargé
            </h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Chargez un programme d'entraînement pour commencer
            </p>
            <button 
              @click="loadDefaultProgram"
              class="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Charger un programme par défaut
            </button>
          </div>
        </div>
        
        <Timer
          v-else
          :program="trainingStore.currentProgramData"
          :current-week="trainingStore.currentWeek"
          :current-day="trainingStore.currentDay"
          @session-completed="handleSessionCompleted"
          ref="timerRef"
        />
      </div>

      <!-- Statistiques rapides - Visible uniquement sur mobile -->
      <div 
        v-if="isMobile"
        class="stats-section mt-8 max-w-md mx-auto px-4"
      >
        <Panel 
          variant="secondary" 
          size="medium" 
          title="Vos progrès" 
          glass
          class="text-center"
        >
          
          <div class="grid grid-cols-3 gap-6 text-center">
            <!-- Séances complétées -->
            <div class="stats-item">
              <div class="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                </svg>
              </div>
              <div class="text-2xl font-bold text-black dark:text-white mb-1">
                {{ trainingStats.completedSessions }}
              </div>
              <div class="text-xs text-black dark:text-white font-medium">
                Séances
              </div>
            </div>

            <!-- Temps total -->
            <div class="stats-item">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <div class="text-2xl font-bold text-black dark:text-white mb-1">
                {{ formatTime(trainingStats.totalTime) }}
              </div>
              <div class="text-xs text-black dark:text-white font-medium">
                Temps total
              </div>
            </div>

            <!-- Série actuelle -->
            <div class="stats-item">
              <div class="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
              <div class="text-2xl font-bold text-black dark:text-white mb-1">
                {{ trainingStats.currentStreak }}
              </div>
              <div class="text-xs text-black dark:text-white font-medium">
                Série
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <!-- Message de motivation -->
      <div 
        v-if="isMobile && motivationalMessage"
        class="motivation-section mt-6 max-w-md mx-auto px-4"
      >
        <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 text-white text-center shadow-lg">
          <p class="text-sm font-medium">
            {{ motivationalMessage }}
          </p>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTrainingStore } from '@/stores/training'
import Timer from '@/components/Timer.vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import Panel from '@/components/ui/Panel.vue'
import { isMobile } from '@/utils/deviceDetection'

// Stores et router
const router = useRouter()
const authStore = useAuthStore()
const trainingStore = useTrainingStore()

// Refs
const timerRef = ref(null)

// Computed properties
const trainingStats = computed(() => trainingStore.getTrainingStats())

const motivationalMessage = computed(() => {
  const messages = [
    "Continuez sur votre lancée ! 💪",
    "Chaque pas compte vers vos objectifs 🎯",
    "Votre santé vous remerciera 🌟",
    "Vous progressez chaque jour ! 🚀",
    "Restez motivé, vous y arrivez ! ✨"
  ]
  
  // Choisir un message basé sur les statistiques
  const streak = trainingStats.value.currentStreak
  if (streak >= 7) return "Une semaine complète ! Vous êtes incroyable ! 🔥"
  if (streak >= 3) return "Excellente régularité ! Continuez ! 💪"
  if (trainingStats.value.completedSessions === 0) return "Bienvenue ! Prêt pour votre première session ? 🌟"
  
  return messages[Math.floor(Math.random() * messages.length)]
})

// Méthodes utilitaires
const formatTime = (seconds) => {
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (minutes < 60) {
    return remainingSeconds > 0 
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}m`
}

/**
 * Gestion de la fin de session d'entraînement
 */
function handleSessionCompleted() {
  trainingStore.completeTraining()
  
  // Afficher une notification de succès
  console.log('Session d\'entraînement terminée avec succès!')
  
  // Optionnel: Vibration sur mobile si supportée
  if (typeof navigator !== 'undefined' && navigator.vibrate && isMobile()) {
    navigator.vibrate([100, 50, 100]) // Pattern de vibration
  }
}

// Méthodes
const loadDefaultProgram = async () => {
  // Charger les programmes disponibles
  await trainingStore.loadPrograms()
  
  // Si aucun programme n'est disponible, créer un programme par défaut
  if (trainingStore.availablePrograms.length === 0) {
    const defaultProgram = {
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
          ]
        }
      }
    }
    
    // Ajouter le programme par défaut
    trainingStore.availablePrograms.push(defaultProgram)
  }
  
  // Démarrer le premier programme disponible
  if (trainingStore.availablePrograms.length > 0) {
    await trainingStore.startProgram(trainingStore.availablePrograms[0].id)
  }
}

// Lifecycle
onMounted(async () => {
  await trainingStore.initializeTraining()
  
  // Si aucun programme n'est chargé, essayer de charger un programme par défaut
  if (!trainingStore.currentProgramData) {
    await loadDefaultProgram()
  }
})
</script>

<style scoped>
/* Dashboard Content */
.dashboard-content {
  min-height: 100vh;
  padding: 1rem 0;
}

/* Program Section */
.timer-section {
  margin-bottom: 2rem;
}

/* Stats Section */
.stats-section {
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

.stats-item {
  transition: transform 0.2s ease-in-out;
}

.stats-item:hover {
  transform: translateY(-2px);
}

/* Motivation Section */
.motivation-section {
  animation: fadeInUp 0.6s ease-out 0.6s both;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .dashboard-content {
    padding: 0.5rem 0;
  }
  
  .stats-section {
    margin-top: 1.5rem;
  }
}

/* Dark mode support (if needed later) */
@media (prefers-color-scheme: dark) {
  .stats-item .text-gray-800 {
    color: #f9fafb;
  }
  
  .stats-item .text-gray-500 {
    color: #9ca3af;
  }
}
</style>
