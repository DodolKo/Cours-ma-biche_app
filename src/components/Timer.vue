<template>
  <!-- Program Component - Minimalist Design -->
  <div class="timer-container">
    
    <!-- Universal Program Interface - Works on all devices -->
    <div class="timer-interface">
      
      <!-- Focus Mode: When timer is running - Hide everything except timer -->
      <div v-if="isRunning" class="focus-mode">
        
        <!-- Exercise Info Header - Grand affichage du type d'exercice -->
        <div class="exercise-header">
          <div class="exercise-type">
            <h2 class="text-4xl font-bold text-white mb-2">
              {{ currentPhase.name }}
            </h2>
            <p class="text-xl text-white/80">
              {{ currentPhase.description }}
            </p>
          </div>
          
          <!-- Steps Counter - Nombre d'étapes restantes -->
          <div class="steps-counter">
            <div class="text-center">
              <div class="text-6xl font-bold text-white mb-2">
                {{ phasesRemaining }}
              </div>
              <div class="text-lg text-white/80">
                {{ phasesRemaining === 1 ? 'étape restante' : 'étapes restantes' }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Central huge timer - Full focus -->
        <div class="central-timer">
          <div class="relative">
            <!-- Progress ring -->
            <svg class="timer-ring" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(34, 197, 94, 0.1)" stroke-width="8"/>
              <circle
                cx="100" cy="100" r="85" fill="none" 
                stroke="var(--primary-color)" stroke-width="8" stroke-linecap="round"
                :stroke-dasharray="circumference" :stroke-dashoffset="progressOffset"
                transform="rotate(-90 100 100)" class="transition-all duration-1000 ease-in-out"
              />
            </svg>
            
            <!-- Timer content -->
            <div class="timer-circle absolute inset-0 flex items-center justify-center">
              <div class="text-center text-white">
                <div class="text-8xl font-bold tabular-nums drop-shadow-lg">
                  {{ formatTime(timeRemaining) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Large accessible pause button -->
        <div class="pause-controls">
          <button
            @click="pauseProgram"
            class="pause-btn"
            aria-label="Pause"
          >
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </button>
        </div>

      </div>

      <!-- Normal Mode: When timer is stopped/paused - Show all UI -->
      <div v-else class="normal-mode">
        
        <!-- Phase info - Moved to top for better mobile visibility -->
        <div class="phase-info">
          <!-- Logo de l'application -->
          <div class="flex justify-center mb-4">
            <img 
              src="/logo - app -192.png" 
              alt="Running App" 
              class="w-16 h-16 object-contain"
            />
          </div>
          
          <h2 class="text-xl font-bold text-black dark:text-white text-center mb-2">
            {{ currentPhase.name }}
          </h2>
          <p class="text-primary-color text-center mb-6 font-medium">
            Semaine {{ currentWeek }} • Jour {{ currentDay }}
          </p>
        </div>

        <!-- Main controls - Moved up for better mobile visibility -->
        <div class="main-controls">
          <button
            @click="startProgram"
            class="start-btn"
            :aria-label="'Démarrer ' + currentPhase.name"
          >
            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>

          <!-- Reset button (if needed) -->
          <button
            v-if="currentPhaseIndex > 0 || timeRemaining !== initialTime"
            @click="resetSession"
            class="reset-btn"
            aria-label="Recommencer"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </div>
        
        <!-- Central timer - Reduced size for mobile -->
        <div class="central-timer">
          <div class="relative">
            <!-- Progress ring -->
            <svg class="timer-ring" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(34, 197, 94, 0.1)" stroke-width="8"/>
              <circle
                cx="100" cy="100" r="85" fill="none" 
                stroke="var(--primary-color)" stroke-width="8" stroke-linecap="round"
                :stroke-dasharray="circumference" :stroke-dashoffset="progressOffset"
                transform="rotate(-90 100 100)" class="transition-all duration-1000 ease-in-out"
              />
            </svg>
            
            <!-- Timer content -->
            <div class="timer-circle absolute inset-0 flex items-center justify-center">
              <div class="text-center text-white">
                <div class="text-8xl font-bold tabular-nums drop-shadow-lg">
                  {{ formatTime(timeRemaining) }}
                </div>
                <div class="text-lg font-medium opacity-90 mt-4">
                  {{ currentPhase.name }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Session progress -->
        <div class="session-progress">
          <div class="progress-card">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium text-black dark:text-white">Session</span>
              <span class="text-sm font-bold text-green-600">
                {{ completedPhases }}/{{ totalPhases }}
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div 
                class="progress-bar h-2 rounded-full transition-all duration-500 ease-out"
                :style="{ width: `${sessionProgress}%` }"
              ></div>
            </div>
          </div>
        </div>

        <!-- Upcoming phases (collapsible) -->
        <div v-if="totalPhases > 1 && upcomingPhases.length > 0" class="upcoming-phases">
          <button 
            @click="showUpcoming = !showUpcoming"
            class="toggle-upcoming"
          >
            {{ showUpcoming ? 'Masquer' : 'Voir' }} les phases suivantes
            <svg class="w-4 h-4 inline ml-1 transition-transform" :class="{ 'rotate-180': showUpcoming }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          
          <div v-if="showUpcoming" class="upcoming-list">
            <div 
              v-for="(phase, index) in upcomingPhases.slice(0, 2)" 
              :key="index"
              class="upcoming-item"
              :class="getPhaseClass(phase.type)"
            >
              <span class="phase-name">{{ phase.name }}</span>
              <span class="phase-duration">{{ formatTime(phase.duration) }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps({
  program: {
    type: Object,
    required: true
  },
  currentWeek: {
    type: Number,
    default: 1
  },
  currentDay: {
    type: Number,
    default: 1
  }
})

// État du programme
const isRunning = ref(false)
const timeRemaining = ref(0)
const currentPhaseIndex = ref(0)
const intervalId = ref(null)
const initialTime = ref(0)
const showUpcoming = ref(false)

// Removed device blocking - program works everywhere now

// Computed properties pour le programme
const currentPhase = computed(() => {
  return props.program.phases[currentPhaseIndex.value] || { 
    name: 'Session terminée', 
    description: 'Félicitations ! Vous avez terminé votre session d\'entraînement.',
    duration: 0, 
    type: 'rest' 
  }
})

const totalPhases = computed(() => props.program.phases.length)
const completedPhases = computed(() => currentPhaseIndex.value)
const sessionProgress = computed(() => {
  if (totalPhases.value === 0) return 0
  return (completedPhases.value / totalPhases.value) * 100
})

const upcomingPhases = computed(() => {
  return props.program.phases.slice(currentPhaseIndex.value + 1, currentPhaseIndex.value + 4)
})

// Circle progress for program
const circumference = computed(() => 2 * Math.PI * 85) // radius = 85

const progressOffset = computed(() => {
  if (initialTime.value === 0) return circumference.value
  const progress = (initialTime.value - timeRemaining.value) / initialTime.value
  return circumference.value - (progress * circumference.value)
})

// Méthodes utilitaires
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

const getPhaseClass = (type) => {
  const classes = {
    warmup: 'phase-warmup',
    run: 'phase-run',
    walk: 'phase-walk',
    rest: 'phase-rest',
    stretch: 'phase-stretch'
  }
  return classes[type] || 'phase-rest'
}

const getPhaseTypeLabel = (type) => {
  const labels = {
    warmup: 'Échauffement',
    run: 'Course',
    walk: 'Marche',
    rest: 'Repos',
    stretch: 'Étirement'
  }
  return labels[type] || 'Phase'
}

const getProgramStatus = () => {
  if (currentPhaseIndex.value >= totalPhases.value) {
    return 'Session terminée !'
  }
  if (isRunning.value) {
    return 'En cours...'
  }
  if (timeRemaining.value === 0) {
    return 'Phase terminée'
  }
  return 'Prêt à commencer'
}

const getMotivationalMessage = () => {
  const messages = {
    warmup: [
      "Préparez votre corps 🌟",
      "Échauffement en douceur 💪",
      "Votre corps se réveille ☀️"
    ],
    walk: [
      "Vous y êtes presque ! 🚶‍♂️",
      "Gardez le rythme 💚",
      "Excellent travail ! 👏",
      "Continuez comme ça ! 🎯"
    ],
    stretch: [
      "Détendez-vous 🧘‍♂️",
      "Récupération active 🌿",
      "Votre corps vous remercie ✨"
    ]
  }
  
  const phaseMessages = messages[currentPhase.value.type] || messages.walk
  const timeLeft = timeRemaining.value
  
  if (timeLeft <= 30) {
    return "Plus que quelques secondes ! 🔥"
  } else if (timeLeft <= 60) {
    return "Dernière minute ! 💪"
  }
  
  return phaseMessages[Math.floor(Math.random() * phaseMessages.length)]
}

const startProgram = () => {
  if (timeRemaining.value <= 0) {
    nextPhase()
    return
  }
  
  isRunning.value = true
  // Désactiver le scroll du body en mode plein écran
  document.body.style.overflow = 'hidden'
  document.body.style.position = 'fixed'
  document.body.style.width = '100%'
  document.body.style.height = '100%'
  
  intervalId.value = setInterval(() => {
    timeRemaining.value--
    if (timeRemaining.value <= 0) {
      nextPhase()
    }
  }, 1000)
}

const pauseProgram = () => {
  isRunning.value = false
  // Réactiver le scroll du body
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.width = ''
  document.body.style.height = ''
  
  if (intervalId.value) {
    clearInterval(intervalId.value)
    intervalId.value = null
  }
}

const toggleProgram = () => {
  if (isRunning.value) {
    pauseProgram()
  } else {
    startProgram()
  }
}

const nextPhase = () => {
  pauseProgram()
  
  if (currentPhaseIndex.value < props.program.phases.length - 1) {
    currentPhaseIndex.value++
    timeRemaining.value = props.program.phases[currentPhaseIndex.value].duration
  } else {
    // Session terminée - réactiver le scroll
    timeRemaining.value = 0
    document.body.style.overflow = ''
    document.body.style.position = ''
    document.body.style.width = ''
    document.body.style.height = ''
    emit('session-completed')
  }
}

const resetSession = () => {
  pauseProgram()
  currentPhaseIndex.value = 0
  const firstPhaseDuration = props.program.phases[0]?.duration || 0
  timeRemaining.value = firstPhaseDuration
  initialTime.value = firstPhaseDuration
}

// Émissions
const emit = defineEmits(['session-completed'])

// Lifecycle
onMounted(() => {
  if (props.program.phases.length > 0) {
    const firstPhaseDuration = props.program.phases[0].duration
    timeRemaining.value = firstPhaseDuration
    initialTime.value = firstPhaseDuration
  }
})

onUnmounted(() => {
  pauseProgram()
  // S'assurer que le scroll est réactivé si le composant est détruit
  document.body.style.overflow = ''
  document.body.style.position = ''
  document.body.style.width = ''
  document.body.style.height = ''
})

// Exposer les méthodes pour le parent
defineExpose({
  resetSession,
  startProgram,
  pauseProgram
})
</script>

<style scoped>
/* Container - Universal Design */
.timer-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, var(--white) 0%, var(--secondary-color) 100%);
}

.timer-interface {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Focus Mode - When program is running */
.focus-mode {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  overflow: hidden;
}

/* Exercise Header - Affichage du type d'exercice et étapes restantes */
.exercise-header {
  position: absolute;
  top: 2rem;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  z-index: 110;
}

.exercise-type {
  text-align: left;
}

.exercise-type h2 {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 0.5rem;
}

.exercise-type p {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.steps-counter {
  text-align: right;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.steps-counter div:first-child {
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.focus-mode .central-timer {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8rem; /* Espace pour le header */
}

/* Responsive adjustments pour mobile */
@media (max-width: 640px) {
  .exercise-header {
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;
    top: 1rem;
  }
  
  .exercise-type {
    text-align: center;
  }
  
  .exercise-type h2 {
    font-size: 2rem;
  }
  
  .exercise-type p {
    font-size: 1rem;
  }
  
  .steps-counter {
    padding: 1rem 1.5rem;
  }
  
  .steps-counter div:first-child {
    font-size: 3rem;
  }
  
  .focus-mode .central-timer {
    margin-top: 12rem; /* Plus d'espace sur mobile */
  }
  
  /* Empêcher le zoom sur les inputs en mode plein écran */
  .focus-mode {
    -webkit-text-size-adjust: 100%;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  
  /* Empêcher le scroll sur mobile */
  .focus-mode {
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: none;
  }
}

.pause-controls {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  /* Ensure it's always visible on small screens */
  z-index: 110;
}

.pause-btn {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.95);
  color: white;
  border: 3px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(15px);
  box-shadow: 
    0 12px 24px rgba(239, 68, 68, 0.4),
    0 4px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
  /* Ensure minimum touch target */
  min-width: 90px;
  min-height: 90px;
}

.pause-btn:hover {
  background: rgba(239, 68, 68, 1);
  transform: scale(1.08);
  box-shadow: 
    0 16px 32px rgba(239, 68, 68, 0.5),
    0 6px 12px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.pause-btn:active {
  transform: scale(0.92);
}

/* Normal Mode - When timer is stopped/paused */
.normal-mode {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1.5rem;
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
}

/* Central Program - Same size in both modes */
.central-timer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0;
  order: 3; /* Place after controls */
}

.timer-ring {
  width: min(350px, 85vw);
  height: min(350px, 85vw);
}

.timer-circle {
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  border-radius: 50%;
  box-shadow: 
    0 20px 40px -10px rgba(34, 197, 94, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* Phase Info */
.phase-info {
  text-align: center;
  order: 1; /* Place at top */
}

/* Main Controls */
.main-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  order: 2; /* Place after phase info */
}

.start-btn {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
  transition: all 0.2s ease;
}

.start-btn:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 12px 25px rgba(34, 197, 94, 0.4);
}

.start-btn:active {
  transform: scale(0.95);
}

.reset-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #9ca3af;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.reset-btn:hover {
  background: #6b7280;
  transform: translateY(-1px);
}

.reset-btn:active {
  transform: scale(0.95);
}

/* Session Progress */
.session-progress {
  margin-top: auto;
  order: 4; /* Place at bottom */
}

.progress-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Upcoming Phases */
.upcoming-phases {
  margin-top: 1rem;
}

.toggle-upcoming {
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: 500;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  width: 100%;
  text-align: center;
}

.toggle-upcoming:hover {
  background: rgba(34, 197, 94, 0.1);
}

.upcoming-list {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  animation: fadeIn 0.3s ease;
}

.upcoming-item {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  justify-content: between;
  align-items: center;
  border-left: 4px solid;
  transition: all 0.2s ease;
}

.upcoming-item:hover {
  transform: translateX(4px);
  background: rgba(255, 255, 255, 0.9);
}

.phase-name {
  font-weight: 500;
  color: #374151;
}

.phase-duration {
  font-weight: 600;
  color: #6b7280;
  margin-left: auto;
}

/* Typography */
.tabular-nums {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum";
}

.drop-shadow-lg {
  filter: drop-shadow(0 10px 8px rgba(0, 0, 0, 0.04)) drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1));
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsive Design */
@media (max-width: 640px) {
  .normal-mode {
    padding: 0.75rem;
    gap: 1rem;
  }
  
  .timer-ring {
    width: min(250px, 80vw);
    height: min(250px, 80vw);
  }
  
  .text-8xl {
    font-size: 3.5rem;
  }
  
  .start-btn {
    width: 90px;
    height: 90px;
    box-shadow: 0 12px 25px rgba(34, 197, 94, 0.5);
  }
  
  .start-btn:hover {
    transform: translateY(-3px) scale(1.08);
    box-shadow: 0 16px 35px rgba(34, 197, 94, 0.6);
  }
  
  .reset-btn {
    width: 60px;
    height: 60px;
  }
  
  /* Ensure pause button is always accessible on mobile */
  .pause-controls {
    bottom: 2rem;
    /* Add safe area for phones with home indicator */
    bottom: max(2rem, env(safe-area-inset-bottom, 2rem));
  }
  
  .pause-btn {
    width: 85px;
    height: 85px;
    min-width: 85px;
    min-height: 85px;
  }
  
  /* Make phase info more compact on mobile */
  .phase-info {
    margin-bottom: 0.5rem;
  }
  
  .phase-info h2 {
    font-size: 1.5rem;
  }
  
  .phase-info p {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }
}

@media (max-width: 375px) {
  .timer-ring {
    width: min(220px, 85vw);
    height: min(220px, 85vw);
  }
  
  .text-8xl {
    font-size: 3rem;
  }
  
  .text-lg {
    font-size: 1rem;
  }
  
  .start-btn {
    width: 85px;
    height: 85px;
  }
  
  .phase-info h2 {
    font-size: 1.25rem;
  }
}

/* Landscape mode on mobile */
@media (orientation: landscape) and (max-height: 600px) {
  .normal-mode {
    padding: 0.5rem;
    gap: 1rem;
  }
  
  .timer-ring {
    width: min(200px, 45vh);
    height: min(200px, 45vh);
  }
  
  .text-8xl {
    font-size: 2.5rem;
  }
  
  .phase-info {
    margin-bottom: 0.5rem;
  }
  
  .central-timer {
    margin: 1rem 0;
  }
}

/* Focus states for accessibility */
button:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Transitions */
.transition-transform {
  transition: transform 0.2s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* Performance optimizations */
.timer-ring circle {
  will-change: stroke-dashoffset;
}

/* Force le contraste pour tous les textes en mode sombre */
.dark .phase-name,
.dark .phase-duration,
.dark .toggle-upcoming,
.dark .upcoming-item,
.dark .upcoming-item * {
  color: #ffffff !important;
}

/* Surcharger les classes de couleur en mode sombre */
.dark .text-primary-color {
  color: var(--primary-color) !important;
}

/* Assurer que les cartes sont visibles en mode sombre */
.dark .progress-card,
.dark .upcoming-item {
  background: rgba(30, 41, 59, 0.9) !important;
  color: #ffffff !important;
}

.dark .upcoming-item:hover {
  background: rgba(30, 41, 59, 1) !important;
}
</style>
