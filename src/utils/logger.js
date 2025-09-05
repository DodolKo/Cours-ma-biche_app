/**
 * Système de logging conditionnel pour la production
 * Les logs ne s'affichent qu'en mode développement
 */

const isDevelopment = import.meta.env.DEV

export const logger = {
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args)
    }
  },
  
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args)
    }
  },
  
  error: (...args) => {
    // Les erreurs sont toujours loggées, même en production
    console.error(...args)
  },
  
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args)
    }
  }
}
