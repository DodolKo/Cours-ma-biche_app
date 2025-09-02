<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- En-tête -->
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complétez votre profil
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ isEditing ? 'Modifiez vos informations' : 'Quelques informations pour personnaliser votre expérience' }}
        </p>
      </div>

      <!-- Formulaire -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <!-- Messages d'erreur/succès -->
        <div v-if="message" :class="messageClass" class="rounded-md p-4">
          <div class="text-sm">
            {{ message }}
          </div>
        </div>

        <!-- Section: Informations personnelles -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900">Informations personnelles</h3>
          
          <!-- Prénom -->
          <div>
            <label for="first_name" class="block text-sm font-medium text-gray-700">
              Prénom *
            </label>
            <input
              id="first_name"
              v-model="formData.first_name"
              name="first_name"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Votre prénom"
            />
          </div>

          <!-- Nom -->
          <div>
            <label for="last_name" class="block text-sm font-medium text-gray-700">
              Nom *
            </label>
            <input
              id="last_name"
              v-model="formData.last_name"
              name="last_name"
              type="text"
              required
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Votre nom"
            />
          </div>

          <!-- Date de naissance -->
          <div>
            <label for="birth_date" class="block text-sm font-medium text-gray-700">
              Date de naissance
            </label>
            <input
              id="birth_date"
              v-model="formData.birth_date"
              name="birth_date"
              type="date"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <!-- Genre -->
          <div>
            <label for="gender" class="block text-sm font-medium text-gray-700">
              Genre
            </label>
            <select
              id="gender"
              v-model="formData.gender"
              name="gender"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Sélectionnez votre genre</option>
              <option value="male">Homme</option>
              <option value="female">Femme</option>
              <option value="other">Autre</option>
            </select>
          </div>
        </div>

        <!-- Section: Informations physiques -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900">Informations physiques (optionnel)</h3>
          
          <div class="grid grid-cols-2 gap-4">
            <!-- Poids -->
            <div>
              <label for="weight" class="block text-sm font-medium text-gray-700">
                Poids (kg)
              </label>
              <input
                id="weight"
                v-model.number="formData.weight"
                name="weight"
                type="number"
                step="0.1"
                min="30"
                max="200"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="70"
              />
            </div>

            <!-- Taille -->
            <div>
              <label for="height" class="block text-sm font-medium text-gray-700">
                Taille (cm)
              </label>
              <input
                id="height"
                v-model.number="formData.height"
                name="height"
                type="number"
                min="120"
                max="250"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="175"
              />
            </div>
          </div>
        </div>

        <!-- Section: Activité -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-900">Niveau d'activité</h3>
          
          <div>
            <label for="activity_level" class="block text-sm font-medium text-gray-700">
              Niveau d'activité physique
            </label>
            <select
              id="activity_level"
              v-model="formData.activity_level"
              name="activity_level"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Sélectionnez votre niveau</option>
              <option value="sedentary">Sédentaire (peu ou pas d'exercice)</option>
              <option value="light">Léger (exercice léger 1-3 jours/semaine)</option>
              <option value="moderate">Modéré (exercice modéré 3-5 jours/semaine)</option>
              <option value="active">Actif (exercice intense 6-7 jours/semaine)</option>
              <option value="very_active">Très actif (exercice très intense, travail physique)</option>
            </select>
          </div>
        </div>

        <!-- Boutons -->
        <div class="flex space-x-4">
          <button
            v-if="isEditing"
            type="button"
            @click="$emit('cancel')"
            class="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Annuler
          </button>
          
          <button
            type="submit"
            :disabled="profileStore.loading || !isFormValid"
            class="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="profileStore.loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" class="opacity-75"></path>
              </svg>
              Sauvegarde...
            </span>
            <span v-else>
              {{ isEditing ? 'Mettre à jour' : 'Créer mon profil' }}
            </span>
          </button>
        </div>

        <!-- Lien pour passer -->
        <div v-if="!isEditing" class="text-center">
          <button
            type="button"
            @click="$emit('skip')"
            class="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Passer cette étape (vous pourrez compléter plus tard)
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProfileStore } from '../../stores/profile'
import { useAuthStore } from '../../stores/auth'

// Props
const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false
  },
  initialData: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['profile-created', 'profile-updated', 'skip', 'cancel'])

// Stores
const profileStore = useProfileStore()
const authStore = useAuthStore()

// État local
const message = ref('')
const messageType = ref('')

// Données du formulaire
const formData = ref({
  first_name: '',
  last_name: '',
  birth_date: '',
  weight: null,
  height: null,
  gender: '',
  activity_level: '',
  running_goals: []
})

// Computed
const messageClass = computed(() => ({
  'bg-red-50 border border-red-200 text-red-800': messageType.value === 'error',
  'bg-green-50 border border-green-200 text-green-800': messageType.value === 'success'
}))

const isFormValid = computed(() => {
  return formData.value.first_name.trim() && formData.value.last_name.trim()
})

// Méthodes
function initializeForm() {
  if (props.isEditing && props.initialData) {
    Object.assign(formData.value, {
      first_name: props.initialData.first_name || '',
      last_name: props.initialData.last_name || '',
      birth_date: props.initialData.birth_date || '',
      weight: props.initialData.weight || null,
      height: props.initialData.height || null,
      gender: props.initialData.gender || '',
      activity_level: props.initialData.activity_level || '',
      running_goals: props.initialData.running_goals || []
    })
  }
}

async function handleSubmit() {
  message.value = ''
  messageType.value = ''

  if (!isFormValid.value) {
    showMessage('Veuillez remplir au moins votre prénom et nom', 'error')
    return
  }

  try {
    const profileData = {
      email: authStore.userEmail,
      ...formData.value
    }

    let result
    if (props.isEditing) {
      result = await profileStore.updateProfile(authStore.user.id, formData.value)
      if (result.success) {
        emit('profile-updated', profileStore.profile)
      }
    } else {
      result = await profileStore.upsertProfile(authStore.user.id, profileData)
      if (result.success) {
        emit('profile-created', profileStore.profile)
      }
    }

    if (result.success) {
      showMessage(result.message, 'success')
    } else {
      showMessage(result.error, 'error')
    }
  } catch (error) {
    showMessage('Une erreur inattendue s\'est produite', 'error')
  }
}

function showMessage(msg, type) {
  message.value = msg
  messageType.value = type
}

// Lifecycle
onMounted(() => {
  initializeForm()
})
</script>
