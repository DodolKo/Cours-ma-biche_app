# 🧪 Tests - Running App

## 📁 Structure des tests

```
test/
├── unit/               # Tests unitaires des composants
├── integration/        # Tests d'intégration des stores
├── e2e/                # Tests end-to-end (futur)
├── fixtures/           # Données de test et mocks
├── setup.js            # Configuration globale des tests
└── vitest.config.js    # Configuration Vitest
```

## 🚀 Commandes de test

```bash
# Lancer tous les tests
npm run test

# Tests en mode watch (re-lance automatiquement)
npm run test:watch

# Tests avec rapport de couverture
npm run test:coverage
```

## 📋 Types de tests

### Tests unitaires (`/unit`)
- Testent les composants Vue individuellement
- Testent les fonctions utilitaires
- Utilisent des mocks pour les dépendances externes

### Tests d'intégration (`/integration`)
- Testent les interactions entre composants
- Testent les stores Pinia avec Supabase
- Testent les flux utilisateur complets

### Tests E2E (`/e2e`) - Futur
- Tests end-to-end avec Playwright ou Cypress
- Testent l'application complète du navigateur

## 🔧 Configuration

### Mocks disponibles
- **Supabase**: Mock complet de l'API Supabase
- **Vue Router**: Mock des fonctions de navigation
- **Pinia**: Configuration automatique des stores

### Données de test (`/fixtures`)
- `mockUser`: Utilisateur de test
- `mockHealthData`: Données de santé de test
- `mockRun`: Course de test
- `mockGoal`: Objectif de test

## 📊 Couverture de code

Objectif: **> 80%** de couverture de code

### Priorités de test
1. **Fonctions de sécurité** (100% requis)
2. **Stores Pinia** (90% requis)
3. **Composants critiques** (80% requis)
4. **Utilitaires** (70% requis)

## 🛡️ Tests de sécurité

Les tests de sécurité sont **CRITIQUES** et doivent couvrir :

- ✅ Validation des données d'entrée
- ✅ Politiques RLS Supabase
- ✅ Chiffrement des données sensibles
- ✅ Gestion des erreurs d'authentification
- ✅ Isolation des données utilisateur

## 📝 Exemples de tests

### Test de composant
```js
import { mount } from '@vue/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  it('should render correctly', () => {
    const wrapper = mount(MyComponent, {
      props: { title: 'Test' }
    })
    expect(wrapper.text()).toContain('Test')
  })
})
```

### Test de store
```js
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with null user', () => {
    const store = useAuthStore()
    expect(store.user).toBeNull()
  })
})
```

---

**⚠️ IMPORTANT**: Tous les tests doivent respecter l'architecture de sécurité en 3 niveaux !
