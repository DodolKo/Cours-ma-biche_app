<script setup>
// Import des dépendances
import { ref, computed } from 'vue';
import { supabase } from '../../utils/supabase';

// Variables réactives pour le formulaire
const email = ref('')
const password = ref('')
const isLoginMode = ref(true) // true = connexion, false = inscription
const isLoading = ref(false)
const errorMessage = ref('')

// Fonction pour basculer entre connexion et inscription
function toggleMode() {
    isLoginMode.value = !isLoginMode.value
    errorMessage.value = '' // Effacer les erreurs lors du changement de mode
}

// Fonction pour récupérer les données utilisateur (votre fonction existante)
async function getUserLogin() {
    const { data } = await supabase.from('userLogin')
    return data
}
</script>

<template>
    <div class="login-container max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <!-- Titre du formulaire -->
        <h2 class="text-2xl font-bold text-center mb-6">
            {{ isLoginMode ? 'Connexion' : 'Créer un compte' }}
        </h2>

        <!-- Message d'erreur -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {{ errorMessage }}
        </div>

        <!-- Formulaire -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Champ email -->
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                    Email
                </label>
                <input
                    id="email"
                    v-model="email"
                    type="email"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="votre@email.com"
                />
            </div>

            <!-- Champ mot de passe -->
            <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe
                </label>
                <input
                    id="password"
                    v-model="password"
                    type="password"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Votre mot de passe"
                />
            </div>

            <!-- Bouton de soumission -->
            <button
                type="submit"
                :disabled="isLoading"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {{ isLoading ? 'Chargement...' : (isLoginMode ? 'Se connecter' : 'Créer le compte') }}
            </button>
        </form>

        <!-- Lien pour basculer entre connexion/inscription -->
        <div class="mt-4 text-center">
            <button
                @click="toggleMode"
                class="text-blue-600 hover:text-blue-800 underline"
            >
                {{ isLoginMode ? 'Pas de compte ? Créer un compte' : 'Déjà un compte ? Se connecter' }}
            </button>
        </div>
    </div>
</template>