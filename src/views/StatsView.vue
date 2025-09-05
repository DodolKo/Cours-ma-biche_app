<template>
  <!-- Statistics View - Placeholder avec design cohérent -->
  <AppLayout>
    <div class="stats-view page-content">
      <div class="max-w-4xl mx-auto px-4 py-8">
        
        <!-- En-tête -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-black dark:text-white mb-2">
            Statistiques
          </h1>
          <p class="text-gray-600 dark:text-gray-300">
            Suivez vos progrès et performances
          </p>
          
          <!-- Message pour desktop/tablette -->
          <div v-if="!isMobile" class="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div class="flex items-center justify-center gap-2 text-blue-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-sm font-medium">
                Utilisez votre mobile pour démarrer une session de course
              </span>
            </div>
          </div>
        </div>

        <!-- Contenu placeholder -->
        <Panel variant="secondary" size="large" glass class="text-center">
          <div class="w-24 h-24 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Page en développement
          </h2>
          
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            Cette section affichera bientôt vos statistiques détaillées, 
            graphiques de progression et historique d'entraînement.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <h3 class="font-semibold text-green-800 dark:text-green-300 mb-2">Performances</h3>
              <p class="text-sm text-green-600 dark:text-green-400">Temps, distance, calories</p>
            </div>
            
            <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <h3 class="font-semibold text-blue-800 dark:text-blue-300 mb-2">Progression</h3>
              <p class="text-sm text-blue-600 dark:text-blue-400">Graphiques et tendances</p>
            </div>
            
            <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <h3 class="font-semibold text-purple-800 dark:text-purple-300 mb-2">Historique</h3>
              <p class="text-sm text-purple-600 dark:text-purple-400">Toutes vos sessions</p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import Panel from '@/components/ui/Panel.vue'
import { isMobile } from '@/utils/deviceDetection'
</script>

<style scoped>
.stats-view {
  min-height: 100vh;
}
</style>
