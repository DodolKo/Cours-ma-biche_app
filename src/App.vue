<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useProfileStore } from './stores/profile'
import AuthForm from './components/layout/AuthForm.vue'
import ProfileSetupForm from './components/layout/ProfileSetupForm.vue'
import LogoutButton from './components/ui/LogoutButton.vue'
import ProfileCard from './components/ui/ProfileCard.vue'

const authStore = useAuthStore()
const profileStore = useProfileStore()

// État local
const showProfileSetup = ref(false)
const showProfileEdit = ref(false)
const profileLoading = ref(false)

// Computed pour vérifier l'état d'authentification
const isAuthenticated = computed(() => authStore.isAuthenticated)
const userEmail = computed(() => authStore.userEmail)
const needsProfileSetup = computed(() => {
  return isAuthenticated.value && (!profileStore.profile || !profileStore.isProfileComplete)
})

// Gestion des événements
async function handleAuthSuccess(data) {
  if (!data.isLogin && authStore.user) {
    // Nouvel utilisateur inscrit - vérifier s'il a besoin de créer un profil
    await checkUserProfile()
  }
}

async function checkUserProfile() {
  if (!authStore.user) return
  
  profileLoading.value = true
  try {
    await profileStore.fetchProfile(authStore.user.id)
    
    // Si pas de profil ou profil incomplet, montrer le formulaire
    if (!profileStore.profile || !profileStore.isProfileComplete) {
      showProfileSetup.value = true
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du profil:', error)
  } finally {
    profileLoading.value = false
  }
}

function handleProfileCreated() {
  showProfileSetup.value = false
}

function handleProfileSkipped() {
  showProfileSetup.value = false
}

function handleEditProfile() {
  showProfileEdit.value = true
}

function handleProfileUpdated() {
  showProfileEdit.value = false
}

function handleCancelEdit() {
  showProfileEdit.value = false
}

function handleLogoutSuccess(message) {
  console.log('Déconnexion réussie:', message)
  profileStore.clearProfile()
}

function handleLogoutError(error) {
  console.error('Erreur de déconnexion:', error)
}

// Lifecycle
onMounted(async () => {
  if (isAuthenticated.value) {
    await checkUserProfile()
  }
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Interface utilisateur connecté -->
    <div v-if="isAuthenticated" class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- En-tête avec informations utilisateur -->
      <div class="bg-white shadow rounded-lg p-6 mb-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold text-gray-900">
              Bienvenue dans Running App
            </h1>
            <p class="text-gray-600 mt-1">
              Connecté en tant que: <span class="font-medium">{{ userEmail }}</span>
            </p>
          </div>
          <LogoutButton 
            @logout-success="handleLogoutSuccess"
            @logout-error="handleLogoutError"
          />
        </div>
      </div>

      <!-- Contenu principal de l'application -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Tableau de bord
        </h2>
        <p class="text-gray-600">
          Votre application de course est prête ! Vous pouvez maintenant développer les fonctionnalités spécifiques à votre app.
        </p>
        
        <!-- Contenu principal avec profil -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Profil utilisateur -->
          <div class="lg:col-span-1">
            <ProfileCard 
              v-if="profileStore.profile"
              :profile="profileStore.profile"
              @edit="handleEditProfile"
            />
            <div v-else class="bg-white shadow rounded-lg p-6 text-center">
              <p class="text-gray-500 mb-4">Aucun profil configuré</p>
              <button
                @click="showProfileSetup = true"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Créer mon profil
              </button>
            </div>
          </div>

          <!-- Contenu principal -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Placeholder pour les futures fonctionnalités -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <h3 class="text-lg font-medium text-gray-900 mb-2">Mes courses</h3>
                <p class="text-gray-500">Prochainement...</p>
              </div>
              <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <h3 class="text-lg font-medium text-gray-900 mb-2">Statistiques</h3>
                <p class="text-gray-500">Prochainement...</p>
              </div>
            </div>
            
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <h3 class="text-lg font-medium text-gray-900 mb-2">Communauté</h3>
              <p class="text-gray-500">Prochainement...</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Configuration du profil (nouveau utilisateur) -->
    <ProfileSetupForm 
      v-else-if="showProfileSetup && isAuthenticated"
      @profile-created="handleProfileCreated"
      @skip="handleProfileSkipped"
    />

    <!-- Édition du profil -->
    <ProfileSetupForm 
      v-else-if="showProfileEdit && isAuthenticated"
      :is-editing="true"
      :initial-data="profileStore.profile"
      @profile-updated="handleProfileUpdated"
      @cancel="handleCancelEdit"
    />

    <!-- Formulaire d'authentification -->
    <AuthForm 
      v-else 
      @auth-success="handleAuthSuccess"
    />
  </div>
</template>

<style scoped>
</style>
