<template>
  <!-- Profile View - Placeholder avec design cohérent -->
  <AppLayout>
    <div class="profile-view">
      <div class="max-w-2xl mx-auto px-4 py-8">
        
        <!-- En-tête -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-800 mb-2">
            Profil
          </h1>
          <p class="text-gray-600">
            Gérez vos informations personnelles et de santé
          </p>
        </div>

        <!-- Contenu placeholder -->
        <div class="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm p-8 border border-green-100 text-center">
          <div class="w-24 h-24 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          
          <h2 class="text-2xl font-bold text-gray-800 mb-4">
            Page en développement
          </h2>
          
          <p class="text-gray-600 mb-6">
            Cette section permettra bientôt de modifier vos informations personnelles, 
            données de santé et préférences d'entraînement.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div class="p-4 bg-green-50 rounded-xl">
              <h3 class="font-semibold text-green-800 mb-2">Informations personnelles</h3>
              <p class="text-sm text-green-600">Nom, âge, photo de profil</p>
            </div>
            
            <div class="p-4 bg-blue-50 rounded-xl">
              <h3 class="font-semibold text-blue-800 mb-2">Données de santé</h3>
              <p class="text-sm text-blue-600">Poids, taille, conditions médicales</p>
            </div>
            
            <div class="p-4 bg-purple-50 rounded-xl">
              <h3 class="font-semibold text-purple-800 mb-2">Préférences</h3>
              <p class="text-sm text-purple-600">Unités, notifications, langue</p>
            </div>
            
            <div class="p-4 bg-orange-50 rounded-xl">
              <h3 class="font-semibold text-orange-800 mb-2">Sécurité</h3>
              <p class="text-sm text-orange-600">Mot de passe, confidentialité</p>
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
.profile-view {
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
