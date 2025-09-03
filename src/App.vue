<template>
  <div id="app">
    <!-- 
      Router View - Point d'entrée pour toutes les vues de l'application
      Le router se charge de la navigation et de l'affichage des composants appropriés
    -->
    <RouterView />
  </div>
</template>

<script setup>
// Aucune logique nécessaire ici - tout est géré par Vue Router et les vues individuelles
// L'authentification et la navigation sont gérées dans les stores et les gardes de navigation
// Les composants PWA sont intégrés dans AppLayout pour une meilleure organisation
</script>

<style scoped>
#app {
  /* Styles globaux pour l'application */
  min-height: 100vh;
}
</style>