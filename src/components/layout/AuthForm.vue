<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- En-tête -->
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {{ isLoginMode ? 'Connexion' : 'Créer un compte' }}
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          {{ isLoginMode 
            ? 'Connectez-vous à votre compte' 
            : 'Rejoignez notre communauté de coureurs'
          }}
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

        <!-- Champs du formulaire -->
        <div class="space-y-4">
          <!-- Email -->
          <div>
            <label for="email" class="sr-only">Adresse email</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Adresse email"
            />
          </div>

          <!-- Mot de passe -->
          <div>
            <label for="password" class="sr-only">Mot de passe</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              :placeholder="isLoginMode ? 'Mot de passe' : 'Mot de passe (min. 6 caractères)'"
              :minlength="isLoginMode ? undefined : 6"
            />
          </div>
        </div>

        <!-- Bouton principal -->
        <div>
          <SubmitButton 
            :loading="authStore.loading"
            :is-login-mode="isLoginMode"
          />
        </div>

        <!-- Lien pour changer de mode -->
        <div class="text-center">
          <ToggleAuthButton 
            :is-login-mode="isLoginMode"
            @toggle="toggleMode"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import SubmitButton from '../ui/SubmitButton.vue'
import ToggleAuthButton from '../ui/ToggleAuthButton.vue'

// Store
const authStore = useAuthStore()

// Emits
const emit = defineEmits(['auth-success'])

// État local
const email = ref('')
const password = ref('')
const isLoginMode = ref(true)
const message = ref('')
const messageType = ref('') // 'success' ou 'error'

// Computed
const messageClass = computed(() => ({
  'bg-red-50 border border-red-200 text-red-800': messageType.value === 'error',
  'bg-green-50 border border-green-200 text-green-800': messageType.value === 'success'
}))

// Méthodes
function toggleMode() {
  isLoginMode.value = !isLoginMode.value
  message.value = ''
  messageType.value = ''
}

async function handleSubmit() {
  message.value = ''
  messageType.value = ''

  if (!email.value || !password.value) {
    showMessage('Veuillez remplir tous les champs', 'error')
    return
  }

  try {
    let result
    
    if (isLoginMode.value) {
      result = await authStore.signIn(email.value, password.value)
    } else {
      result = await authStore.signUp(email.value, password.value)
    }

    if (result.success) {
      showMessage(result.message, 'success')
      
      // Réinitialiser le formulaire en cas de succès pour l'inscription
      if (!isLoginMode.value) {
        email.value = ''
        password.value = ''
      }
      
      // Émettre l'événement pour notifier le parent
      emit('auth-success', { isLogin: isLoginMode.value, user: authStore.user })
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
</script>
