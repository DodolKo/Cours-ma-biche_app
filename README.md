# 🏃‍♂️ Running App - Application de Course Simple

[![Netlify Status](https://api.netlify.com/api/v1/badges/64dea26c-519b-44ec-ad24-e2d8f3b6c3d3/deploy-status)](https://app.netlify.com/projects/coursmabiche/deploys)

Une application Vue 3 moderne pour le suivi de course avec authentification Supabase simple et efficace.

## ✨ Fonctionnalités

### 🔐 Authentification Simple
- Inscription/Connexion avec email + mot de passe
- Nom d'utilisateur personnalisable
- Confirmation par email (Supabase)
- Gestion sécurisée des sessions

### 👤 Profil Utilisateur Basique
- Email (depuis l'authentification)
- Nom d'utilisateur modifiable
- Interface simple et claire

### 🎨 Interface Moderne
- Design responsive avec Tailwind CSS
- Formulaires simples et intuitifs
- Messages d'erreur clairs
- Navigation fluide

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Supabase

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd running_app

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos clés Supabase
```

### Configuration Supabase

1. **Créer un projet Supabase**
   - Aller sur [supabase.com](https://supabase.com)
   - Créer un nouveau projet
   - Noter l'URL et la clé anonyme

2. **Pas de configuration BDD nécessaire !**
   - Supabase gère automatiquement l'authentification
   - Pas besoin de créer de tables pour commencer
   - Les métadonnées utilisateur sont stockées automatiquement

3. **Variables d'environnement**
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### Lancement

```bash
# Mode développement
npm run dev

# Build de production
npm run build

# Prévisualisation du build
npm run preview
```

## 🏗️ Architecture

### Stack Technique
- **Frontend**: Vue 3 + Composition API + `<script setup>`
- **Build**: Vite
- **Styling**: Tailwind CSS v4
- **State**: Pinia
- **Router**: Vue Router 4
- **Backend**: Supabase (PostgreSQL + Auth + RLS)

### Séparation des Données

```mermaid
graph TD
    A[Utilisateur] --> B[Niveau 1: Auth Metadata]
    A --> C[Niveau 2: Profil]
    A --> D[Niveau 3: Données Santé]
    A --> E[Niveau 4: Géolocalisation]
    
    B --> F[Non-sensible]
    C --> G[Modérément sensible]
    D --> H[Très sensible]
    E --> I[Sensible + Temporaire]
```

### Stores Pinia

```javascript
// Authentification
const authStore = useAuthStore()
await authStore.signUp(email, password, username)

// Thème
const themeStore = useThemeStore()
themeStore.setTheme('dark')

// Entraînement
const trainingStore = useTrainingStore()
await trainingStore.loadPrograms()
```

## 🔒 Sécurité

### Politiques de Sécurité (RLS)
- **Row Level Security** activé sur toutes les tables
- Accès limité à `auth.uid() = user_id`
- Validation côté serveur avec contraintes SQL
- Audit trail pour les données sensibles

### Validation des Données
```javascript
// Validation automatique dans les stores
const validation = secureStore.validateHealthData({
  weight: 70.5,
  height: 175,
  birth_date: '1990-01-01'
})

if (!validation.valid) {
  console.error(validation.error)
}
```

### Chiffrement
- Connexions HTTPS obligatoires
- Données ultra-sensibles chiffrées côté client
- Clés de session sécurisées
- Expiration automatique des tokens

## 🧩 Utilisation

### Inscription d'un Utilisateur

```vue
<template>
  <CompleteProfileSetup 
    @setup-complete="handleSetupComplete"
    @cancel="handleCancel"
  />
</template>

<script setup>
import CompleteProfileSetup from '@/components/profile/CompleteProfileSetup.vue'

function handleSetupComplete(data) {
  console.log('Configuration terminée:', data)
  router.push('/dashboard')
}
</script>
```

### Accès aux Données Utilisateur

```javascript
import { useAuthStore, useThemeStore, useTrainingStore } from '@/stores'

// Informations de base
const authStore = useAuthStore()
console.log(`Utilisateur: ${authStore.userFullName}`)

// Thème
const themeStore = useThemeStore()
console.log(`Thème actuel: ${themeStore.currentTheme}`)

// Entraînement
const trainingStore = useTrainingStore()
await trainingStore.loadPrograms()
console.log(`Programmes disponibles: ${trainingStore.availablePrograms.length}`)
```

### Gestion des Thèmes

```javascript
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

// Changer de thème
themeStore.setTheme('dark')

// Basculer entre les thèmes
themeStore.toggleTheme()

// Obtenir le thème actuel
console.log('Thème:', themeStore.currentTheme)
```

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests avec couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

### Exemple de Test

```javascript
import { useAuthStore } from '@/stores/auth'

describe('AuthStore', () => {
  it('should sign up user successfully', async () => {
    const store = useAuthStore()
    const result = await store.signUp('test@example.com', 'password123', 'testuser')
    
    expect(result.success).toBe(true)
    expect(store.isAuthenticated).toBe(true)
  })
})
```

## 📱 Interface Utilisateur

### Fonctionnalités Principales
1. **Authentification**: Inscription/Connexion sécurisée
2. **Thèmes**: Mode clair/sombre avec détection système
3. **Entraînement**: Programmes de course personnalisés
4. **Timer**: Chronomètre avec phases d'entraînement

### Responsive Design
- Mobile-first avec Tailwind CSS
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Navigation adaptative
- Formulaires optimisés tactile

## 📚 Documentation

### Guides Disponibles
- [`guide/PWA_SETUP.md`](guide/PWA_SETUP.md) - Configuration PWA

### Structure des Composants
```
src/components/
├── layout/
│   ├── AppLayout.vue               # Layout principal
│   ├── MobileHeader.vue           # Header mobile
│   ├── MobileNavigation.vue       # Navigation mobile
│   └── DesktopNavigation.vue      # Navigation desktop
├── training/
│   └── Timer.vue                  # Composant timer
├── ui/
│   └── ...                        # Composants UI
└── PWA*.vue                       # Composants PWA
```

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

### Variables d'Environnement
```env
# Production
VITE_SUPABASE_URL=https://your-production.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### Checklist
- [ ] Tests passent
- [ ] Build sans erreurs
- [ ] Variables d'environnement configurées
- [ ] Base de données migrée
- [ ] Politiques RLS activées

## 🤝 Contribution

### Standards de Code
- Vue 3 + Composition API obligatoire
- `<script setup>` pour tous les composants
- Tailwind CSS pour le styling
- Tests unitaires pour les stores critiques

### Workflow
1. Fork du projet
2. Créer une branche feature
3. Développer avec tests
4. Pull request avec description détaillée

## 📄 Licence

MIT License - Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

### Issues Communes

**Erreur de connexion Supabase**
```javascript
// Vérifier les variables d'environnement
console.log('URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY)
```

**Problème de géolocalisation**
```javascript
// Vérifier les permissions
const permission = await navigator.permissions.query({name: 'geolocation'})
console.log('Permission:', permission.state)
```

**Données non sauvegardées**
```javascript
// Vérifier l'authentification
if (!authStore.isAuthenticated) {
  console.error('Utilisateur non connecté')
}
```

### Contact
- GitHub Issues pour les bugs
- Discussions pour les questions
- Email: [contact@example.com](mailto:contact@example.com)

---

**⚠️ Important**: Cette application gère des données de santé. Respectez toujours les réglementations RGPD et les bonnes pratiques de sécurité.