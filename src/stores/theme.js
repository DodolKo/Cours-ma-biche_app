import { defineStore } from 'pinia'
import { ref, computed, watch, readonly } from 'vue'

/**
 * Store pour la gestion des thèmes (blanc/sombre)
 * Supporte la détection automatique des préférences système
 * et la persistance des choix utilisateur
 */
export const useThemeStore = defineStore('theme', () => {
  // État réactif
  const theme = ref('system') // 'light', 'dark', 'system'
  const isDark = ref(false)
  const isLight = ref(true)
  
  // Computed properties
  const currentTheme = computed(() => {
    if (theme.value === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme.value
  })
  
  const themeClasses = computed(() => ({
    'dark': currentTheme.value === 'dark',
    'light': currentTheme.value === 'light'
  }))
  
  // Actions
  const setTheme = (newTheme) => {
    if (!['light', 'dark', 'system'].includes(newTheme)) {
      console.warn('Thème invalide:', newTheme)
      return
    }
    
    theme.value = newTheme
    updateThemeState()
    saveThemePreference()
  }
  
  const toggleTheme = () => {
    if (theme.value === 'system') {
      // Si on est en mode système, basculer vers le thème opposé
      const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(systemIsDark ? 'light' : 'dark')
    } else {
      // Basculer entre light et dark
      setTheme(theme.value === 'light' ? 'dark' : 'light')
    }
  }
  
  const updateThemeState = () => {
    const actualTheme = currentTheme.value
    isDark.value = actualTheme === 'dark'
    isLight.value = actualTheme === 'light'
    
    // Appliquer les classes au document
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(actualTheme)
  }
  
  const saveThemePreference = () => {
    try {
      localStorage.setItem('running-app-theme', theme.value)
    } catch (error) {
      console.warn('Impossible de sauvegarder la préférence de thème:', error)
    }
  }
  
  const loadThemePreference = () => {
    try {
      const saved = localStorage.getItem('running-app-theme')
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        theme.value = saved
      }
    } catch (error) {
      console.warn('Impossible de charger la préférence de thème:', error)
    }
  }
  
  const initializeTheme = () => {
    // Charger la préférence sauvegardée
    loadThemePreference()
    
    // Mettre à jour l'état initial
    updateThemeState()
    
    // Écouter les changements de préférence système
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => {
      if (theme.value === 'system') {
        updateThemeState()
      }
    }
    
    // Support moderne
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange)
    } else {
      // Support legacy
      mediaQuery.addListener(handleSystemThemeChange)
    }
    
    // Nettoyer l'écouteur au démontage
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange)
      } else {
        mediaQuery.removeListener(handleSystemThemeChange)
      }
    }
  }
  
  // Watcher pour les changements de thème
  watch(currentTheme, () => {
    updateThemeState()
  })
  
  return {
    // État
    theme: readonly(theme),
    isDark: readonly(isDark),
    isLight: readonly(isLight),
    
    // Computed
    currentTheme: readonly(currentTheme),
    themeClasses: readonly(themeClasses),
    
    // Actions
    setTheme,
    toggleTheme,
    initializeTheme
  }
})
