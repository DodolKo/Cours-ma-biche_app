/**
 * Programmes d'entraînement basés sur "Je cours pour ma forme"
 * https://jogging.jograph.be/les-entrainements-je-cours-pour-ma-forme/
 */

// Types de phases disponibles
export const PHASE_TYPES = {
  WARMUP: 'warmup',    // Échauffement
  WALK: 'walk',        // Marche
  STRETCH: 'stretch'   // Étirements
}

// Programmes d'entraînement pour la semaine 1
export const WEEK_1_PROGRAMS = {
  // Jour 1 ou 2 - Semaine 1
  day1_2: {
    id: 'week1_day1_2',
    name: 'Jour 1 ou 2 - Semaine 1',
    description: 'Première séance d\'entraînement - Début en douceur',
    totalDuration: 600, // 10 minutes total
    phases: [
      {
        name: 'Échauffement',
        type: PHASE_TYPES.WARMUP,
        duration: 600, // 10 minutes
        description: 'Marche lente et étirements légers pour préparer le corps'
      }
    ]
  },

  // Jour 3 ou 4 - Semaine 1  
  day3_4: {
    id: 'week1_day3_4',
    name: 'Jour 3 ou 4 - Semaine 1',
    description: 'Deuxième séance - Introduction de la marche',
    totalDuration: 600, // 10 minutes total
    phases: [
      {
        name: 'Échauffement',
        type: PHASE_TYPES.WARMUP,
        duration: 300, // 5 minutes
        description: 'Marche lente et étirements légers'
      },
      {
        name: 'Marche',
        type: PHASE_TYPES.WALK,
        duration: 240, // 4 minutes
        description: 'Marche à rythme modéré'
      },
      {
        name: 'Étirements',
        type: PHASE_TYPES.STRETCH,
        duration: 60, // 1 minute
        description: 'Étirements pour récupérer'
      }
    ]
  }
}

// Programmes d'entraînement pour la semaine 2 (exemples)
export const WEEK_2_PROGRAMS = {
  // Jour 1 ou 2 - Semaine 2
  day1_2: {
    id: 'week2_day1_2',
    name: 'Jour 1 ou 2 - Semaine 2',
    description: 'Progression de la semaine 2',
    totalDuration: 600, // 10 minutes total
    phases: [
      {
        name: 'Échauffement',
        type: PHASE_TYPES.WARMUP,
        duration: 300, // 5 minutes
        description: 'Échauffement progressif'
      },
      {
        name: 'Marche',
        type: PHASE_TYPES.WALK,
        duration: 240, // 4 minutes
        description: 'Marche à rythme soutenu'
      },
      {
        name: 'Étirements',
        type: PHASE_TYPES.STRETCH,
        duration: 60, // 1 minute
        description: 'Étirements de récupération'
      }
    ]
  },

  // Jour 3 ou 4 - Semaine 2
  day3_4: {
    id: 'week2_day3_4',
    name: 'Jour 3 ou 4 - Semaine 2',
    description: 'Séance plus intensive de la semaine 2',
    totalDuration: 600, // 10 minutes total
    phases: [
      {
        name: 'Échauffement',
        type: PHASE_TYPES.WARMUP,
        duration: 240, // 4 minutes
        description: 'Échauffement dynamique'
      },
      {
        name: 'Marche',
        type: PHASE_TYPES.WALK,
        duration: 300, // 5 minutes
        description: 'Marche à rythme modéré à soutenu'
      },
      {
        name: 'Étirements',
        type: PHASE_TYPES.STRETCH,
        duration: 60, // 1 minute
        description: 'Étirements complets'
      }
    ]
  }
}

// Fonction utilitaire pour obtenir un programme
export function getTrainingProgram(week, day) {
  const weekKey = `WEEK_${week}_PROGRAMS`
  const dayKey = day <= 2 ? 'day1_2' : 'day3_4'
  
  if (week === 1) {
    return WEEK_1_PROGRAMS[dayKey]
  } else if (week === 2) {
    return WEEK_2_PROGRAMS[dayKey]
  }
  
  // Par défaut, retourner le premier programme de la semaine 1
  return WEEK_1_PROGRAMS.day1_2
}

// Fonction pour obtenir tous les programmes disponibles
export function getAllPrograms() {
  return {
    week1: WEEK_1_PROGRAMS,
    week2: WEEK_2_PROGRAMS
  }
}

// Fonction pour calculer la durée totale d'un programme
export function getProgramTotalDuration(program) {
  return program.phases.reduce((total, phase) => total + phase.duration, 0)
}

// Fonction pour obtenir le nombre de phases d'un programme
export function getProgramPhaseCount(program) {
  return program.phases.length
}

