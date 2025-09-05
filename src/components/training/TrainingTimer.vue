<template>
  <div class="training-timer bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
    <!-- Header -->
    <div class="text-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
        {{ currentProgram?.name || 'Aucun programme' }}
      </h2>
      <p class="text-gray-600 dark:text-gray-300">
        Semaine {{ userProgress?.current_week || 1 }} - Jour {{ userProgress?.current_day || 1 }}
      </p>
    </div>

    <!-- Timer principal -->
    <div class="text-center mb-6">
      <div class="text-6xl font-mono font-bold text-blue-600 dark:text-blue-400 mb-2">
        <span v-if="loading">Chargement...</span>
        <span v-else>{{ formatTime(timeRemaining) }}</span>
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        <span v-if="loading">Veuillez patienter</span>
        <span v-else>Temps total: {{ formatTime(totalTime) }}</span>
      </div>
      
      <!-- Barre de progression -->
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
        <div 
          class="bg-blue-600 h-2 rounded-full transition-all duration-1000"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>

    <!-- Phase actuelle -->
    <div v-if="currentPhaseData && !loading" class="text-center mb-6">
      <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          {{ getPhaseLabel(currentPhaseData.type) }}
        </h3>
        <p class="text-gray-600 dark:text-gray-300">
          {{ currentPhaseData.description }}
        </p>
        <div class="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
          {{ currentPhaseData.duration }} min
        </div>
      </div>
    </div>

    <!-- Chargement des phases -->
    <div v-else-if="loading" class="text-center mb-6">
      <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
        <div class="animate-pulse">
          <div class="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div class="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
          <div class="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16 mx-auto"></div>
        </div>
      </div>
    </div>

    <!-- Informations -->
    <div class="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
      <span>Étapes restantes: {{ phasesRemaining }}</span>
      <span>Phase {{ currentPhase + 1 }}/{{ phases.length }}</span>
    </div>

    <!-- Contrôles -->
    <div v-if="!loading" class="flex justify-center space-x-4">
      <button
        v-if="!isRunning"
        @click="startTimer"
        class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
      >
        Démarrer
      </button>
      <button
        v-else
        @click="pauseTimer"
        class="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
      >
        Pause
      </button>
      
      <button
        @click="resetTimer"
        class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
      >
        Reset
      </button>
    </div>

    <!-- Contrôles désactivés pendant le chargement -->
    <div v-else class="flex justify-center space-x-4">
      <button
        disabled
        class="bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
      >
        Chargement...
      </button>
    </div>

    <!-- Bouton pour changer de programme -->
    <div class="mt-6 text-center">
      <button
        @click="changeProgram"
        class="text-blue-600 dark:text-blue-400 hover:underline text-sm"
      >
        Changer de programme
      </button>
    </div>
  </div>
</template>

<script setup>
import { useTrainingStore } from '@/stores/training'

const trainingStore = useTrainingStore()
const { 
  currentProgram, 
  userProgress, 
  loading,
  isRunning, 
  timeRemaining, 
  totalTime, 
  currentPhase, 
  phases, 
  currentPhaseData, 
  phasesRemaining, 
  progressPercentage,
  startTimer, 
  pauseTimer, 
  resetTimer, 
  formatTime 
} = trainingStore

const getPhaseLabel = (type) => {
  const labels = {
    warmup: 'Échauffement',
    walk: 'Marche',
    run: 'Course',
    stretch: 'Étirements'
  }
  return labels[type] || type
}

const changeProgram = () => {
  // Reset la progression pour permettre de changer de programme
  trainingStore.resetProgress()
}
</script>

<style scoped>
.training-timer {
  max-width: 400px;
  margin: 0 auto;
}

/* Animation pour le timer */
.text-6xl {
  transition: all 0.3s ease;
}

/* Effet de pulsation quand le timer est actif */
.is-running .text-6xl {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
