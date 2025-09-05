<template>
  <div class="login-container">
    
    <!-- App branding header -->
    <div class="app-branding">
      <div class="app-icon">
        <div class="icon-circle">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
        </div>
      </div>
      <h1 class="app-title">Cours ma Biche !</h1>
      <p class="app-tagline">Votre coach Carolo de course à pied</p>
    </div>

    <!-- Login card -->
    <div class="login-card">
      <!-- Mode toggle pills -->
      <div class="mode-toggle">
        <button
          type="button"
          @click="isLogin = true"
          :class="['mode-pill', { active: isLogin }]"
        >
          Connexion
        </button>
        <button
          type="button"
          @click="isLogin = false"
          :class="['mode-pill', { active: !isLogin }]"
        >
          Inscription
        </button>
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="handleSubmit" class="login-form">
        <!-- Username (seulement pour inscription) -->
        <div v-if="!isLogin" class="form-group">
          <label for="username" class="form-label">
            Nom d'utilisateur
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            :required="!isLogin"
            maxlength="30"
            placeholder="johndoe"
            class="form-input"
          />
        </div>

        <!-- Email -->
        <div class="form-group">
          <label for="email" class="form-label">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="john@example.com"
            class="form-input"
          />
        </div>

        <!-- Password avec toggle -->
        <div class="form-group">
          <label for="password" class="form-label">
            Mot de passe
          </label>
          <div class="password-input-container">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              :minlength="isLogin ? 1 : 6"
              placeholder="••••••••"
              class="form-input password-input"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="password-toggle"
              :title="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
            >
              <svg v-if="!showPassword" class="password-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <svg v-else class="password-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
              </svg>
            </button>
          </div>
          <p v-if="!isLogin" class="form-help">
            Minimum 6 caractères
          </p>
        </div>

        <!-- Erreur -->
        <div v-if="error" class="error-message">
          <p>{{ error }}</p>
        </div>

        <!-- Message de succès -->
        <div v-if="successMessage" class="success-message">
          <p>{{ successMessage }}</p>
        </div>

        <!-- Submit button -->
        <button
          type="submit"
          :disabled="loading"
          class="submit-button"
        >
          <span v-if="loading" class="loading-spinner"></span>
          {{ loading ? 'Connexion...' : (isLogin ? 'Se connecter' : 'Créer mon compte') }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Router et store
const router = useRouter()
const authStore = useAuthStore()

// État local
const isLogin = ref(true)
const email = ref('')
const password = ref('')
const username = ref('')
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const showPassword = ref(false)

/**
 * Clear form state when switching modes
 */
function clearFormState() {
  error.value = ''
  successMessage.value = ''
  showPassword.value = false
}

// Watch for mode changes and clear form state
watch(isLogin, () => {
  clearFormState()
})

/**
 * Basculer la visibilité du mot de passe
 */
function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

/**
 * Soumettre le formulaire
 */
async function handleSubmit() {
  loading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    let result

    if (isLogin.value) {
      // Connexion
      result = await authStore.signIn(email.value, password.value)
    } else {
      // Inscription
      result = await authStore.signUp(email.value, password.value, username.value)
    }

    if (result.success) {
      if (isLogin.value) {
        // Connexion réussie - aller au dashboard
        router.push('/dashboard')
      } else {
        // Inscription réussie
        if (result.message.includes('email')) {
          successMessage.value = result.message
        } else {
          // Utilisateur connecté directement - aller au profil setup
          router.push('/profile-setup')
        }
      }
    } else {
      error.value = result.error
    }
  } catch (err) {
    error.value = 'Une erreur est survenue'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Container - Full screen modern design */
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--white) 0%, var(--secondary-color) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  position: relative;
  gap: 3rem;
}

.login-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(134, 239, 172, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.03) 0%, transparent 70%);
  pointer-events: none;
}

/* App Branding - Like program interface */
.app-branding {
  text-align: center;
  z-index: 1;
  animation: fadeInDown 0.8s ease-out;
}

.app-icon {
  margin-bottom: 1.5rem;
}

.icon-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 
    0 20px 40px -10px rgba(34, 197, 94, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: float 3s ease-in-out infinite;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
}

.app-tagline {
  color: var(--gray-600);
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
  opacity: 0.8;
}

/* Login Card - Minimal and clean */
.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(34, 197, 94, 0.1);
  box-shadow: 
    0 25px 50px -12px rgba(34, 197, 94, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.3);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
  position: relative;
  z-index: 1;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

/* Mode Toggle Pills */
.mode-toggle {
  display: flex;
  background: var(--gray-100);
  border-radius: 16px;
  padding: 4px;
  margin-bottom: 2rem;
  position: relative;
}

.mode-pill {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--gray-500);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  z-index: 2;
}

.mode-pill.active {
  background: var(--white);
  color: var(--primary-color);
  box-shadow: 
    0 2px 4px rgba(34, 197, 94, 0.1),
    0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Form Styling - Clean and modern */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-700);
  margin: 0;
  margin-left: 0.25rem;
}

/* Modern Input Design */
.form-input {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 2px solid transparent;
  border-radius: 16px;
  font-size: 1rem;
  color: var(--gray-800);
  background: var(--gray-50);
  transition: all 0.2s ease;
  box-sizing: border-box;
  font-weight: 500;
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-color);
  background: var(--white);
  box-shadow: 
    0 0 0 3px rgba(34, 197, 94, 0.08),
    0 2px 4px rgba(34, 197, 94, 0.1);
  transform: translateY(-1px);
}

.form-input::placeholder {
  color: var(--gray-400);
  font-weight: 400;
}

/* Container pour le mot de passe avec toggle */
.password-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input {
  padding-right: 3rem;
}

.password-toggle {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: #6b7280;
  transition: color 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover {
  color: #374151;
}

.password-toggle:focus {
  outline: none;
  color: #3b82f6;
}

.password-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Texte d'aide */
.form-help {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

/* Messages d'erreur et de succès */
.error-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 0.75rem;
  margin: 0;
}

.error-message p {
  color: #dc2626;
  font-size: 0.875rem;
  margin: 0;
}

.success-message {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 0.75rem;
  margin: 0;
}

.success-message p {
  color: #16a34a;
  font-size: 0.875rem;
  margin: 0;
}

/* Submit Button - Like program start button */
.submit-button {
  width: 100%;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 
    0 8px 20px rgba(34, 197, 94, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  background: linear-gradient(135deg, var(--primary-dark) 0%, #15803d 100%);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 12px 28px rgba(34, 197, 94, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0) scale(1);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Loading Spinner */
.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Animations */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* Responsive Design */
@media (max-width: 640px) {
  .login-container {
    padding: 1rem 0.75rem;
    gap: 2rem;
  }
  
  .app-title {
    font-size: 2rem;
  }
  
  .icon-circle {
    width: 64px;
    height: 64px;
  }
  
  .login-card {
    padding: 1.5rem;
    max-width: 100%;
  }
  
  .form-input {
    padding: 0.875rem 1rem;
    border-radius: 12px;
  }
  
  .submit-button {
    padding: 0.875rem 1rem;
    border-radius: 12px;
  }
  
  .mode-toggle {
    border-radius: 12px;
  }
  
  .mode-pill {
    border-radius: 8px;
    padding: 0.625rem 1rem;
  }
}

@media (max-width: 375px) {
  .app-title {
    font-size: 1.75rem;
  }
  
  .login-card {
    padding: 1.25rem;
  }
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .form-input,
  .submit-button,
  .password-toggle,
  .mode-pill,
  .icon-circle {
    animation: none;
    transition: none;
  }
  
  .app-branding,
  .login-card {
    animation: none;
  }
}

/* Focus states for accessibility */
.form-input:focus-visible,
.submit-button:focus-visible,
.password-toggle:focus-visible,
.mode-pill:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Dark mode support */
.dark .login-container {
  background: linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%);
}

.dark .login-card {
  background: rgba(30, 41, 59, 0.95);
  border-color: rgba(34, 197, 94, 0.2);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

.dark .mode-pill {
  background: var(--gray-700);
  color: var(--gray-300);
}

.dark .mode-pill.active {
  background: var(--primary-color);
  color: var(--gray-900);
}

.dark .form-input {
  background: var(--gray-700);
  border-color: var(--gray-600);
  color: var(--gray-100);
}

.dark .form-input:focus {
  background: var(--gray-600);
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.dark .form-label {
  color: var(--gray-200);
}

.dark .password-toggle {
  color: var(--gray-400);
}

.dark .password-toggle:hover {
  color: var(--gray-200);
}

.dark .form-help {
  color: var(--gray-400);
}

.dark .error-message {
  background-color: rgba(220, 38, 38, 0.1);
  border-color: rgba(220, 38, 38, 0.2);
}

.dark .success-message {
  background-color: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.2);
}

/* Assurer que tous les textes sont visibles en mode sombre */
.dark .app-title,
.dark .app-tagline,
.dark .form-label,
.dark .form-help,
.dark .error-message p,
.dark .success-message p {
  color: #ffffff !important;
}

.dark .form-input::placeholder {
  color: var(--gray-400) !important;
}

/* Fallback pour les préférences système */
@media (prefers-color-scheme: dark) {
  .login-container {
    background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
  }
  
  .login-card {
    background: rgba(31, 41, 55, 0.95);
    border-color: rgba(34, 197, 94, 0.2);
  }
  
  .form-input {
    background: rgba(55, 65, 81, 0.5);
    color: #f9fafb;
  }
  
  .form-input:focus {
    background: rgba(55, 65, 81, 0.8);
  }
}
</style>