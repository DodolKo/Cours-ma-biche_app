<template>
  <!-- Goals View - Placeholder avec design cohérent -->
  <AppLayout>
    <div class="goals-view">
      <div class="max-w-4xl mx-auto px-4 py-8">
        
        <!-- En-tête -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">
            Objectifs
          </h1>
          <p class="text-gray-600">
            Définissez et suivez vos objectifs de course
          </p>
        </div>

        <!-- Contenu placeholder -->
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-8 border border-green-100 text-center">
          <div class="w-24 h-24 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
            </svg>
          </div>
          
          <h2 class="text-2xl font-bold text-gray-800 mb-4">
            Page en développement
          </h2>
          
          <p class="text-gray-600 mb-6">
            Cette section permettra bientôt de créer, modifier et suivre 
            vos objectifs personnalisés de course et de santé.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div class="p-4 bg-green-50 rounded-xl">
              <h3 class="font-semibold text-green-800 mb-2">Objectifs de temps</h3>
              <p class="text-sm text-green-600">Durée de course, fréquence</p>
            </div>
            
            <div class="p-4 bg-blue-50 rounded-xl">
              <h3 class="font-semibold text-blue-800 mb-2">Objectifs de distance</h3>
              <p class="text-sm text-blue-600">Kilomètres parcourus</p>
            </div>
            
            <div class="p-4 bg-purple-50 rounded-xl">
              <h3 class="font-semibold text-purple-800 mb-2">Objectifs de santé</h3>
              <p class="text-sm text-purple-600">Poids, forme physique</p>
            </div>
            
            <div class="p-4 bg-orange-50 rounded-xl">
              <h3 class="font-semibold text-orange-800 mb-2">Défis personnels</h3>
              <p class="text-sm text-orange-600">Challenges et récompenses</p>
            </div>
            
            <div class="p-4 bg-pink-50 rounded-xl">
              <h3 class="font-semibold text-pink-800 mb-2">Suivi de progression</h3>
              <p class="text-sm text-pink-600">Graphiques et notifications</p>
            </div>
            
            <div class="p-4 bg-indigo-50 rounded-xl">
              <h3 class="font-semibold text-indigo-800 mb-2">Objectifs sociaux</h3>
              <p class="text-sm text-indigo-600">Partage et motivation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
</script>

<style scoped>
.goals-view {
  min-height: 100vh;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
