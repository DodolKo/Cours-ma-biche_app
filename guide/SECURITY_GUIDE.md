# 🔒 Guide de Sécurité - Running App

## 🚨 Problèmes de sécurité identifiés et solutions

### ❌ **PROBLÈME INITIAL**
- Toutes les données utilisateur dans une seule table `profiles`
- Données sensibles (poids, âge) accessibles via RLS basique
- Métadonnées utilisateur non utilisées
- Risque d'exposition de données personnelles

### ✅ **SOLUTION SÉCURISÉE IMPLÉMENTÉE**

## 📊 Architecture de sécurité en 3 niveaux

### 🔓 **Niveau 1 : Métadonnées Auth (Non-sensibles)**
**Stockage :** `auth.users.user_metadata`  
**Sécurité :** Chiffré par Supabase, accessible uniquement à l'utilisateur  
**Contenu :**
- `first_name` - Prénom
- `last_name` - Nom
- `display_name` - Nom d'affichage
- `avatar_url` - URL de l'avatar

```js
// Exemple d'utilisation
const { userFirstName, userLastName } = useAuthStore()
```

### 🔒 **Niveau 2 : Données de Santé (Sensibles)**
**Stockage :** Table `user_health_data`  
**Sécurité :** RLS strict + chiffrement  
**Contenu :**
- `birth_date` - Date de naissance
- `weight` - Poids
- `height` - Taille
- `gender` - Genre
- `activity_level` - Niveau d'activité
- `medical_conditions` - Conditions médicales

### 🔐 **Niveau 3 : Données Ultra-sensibles (Chiffrées)**
**Stockage :** Champs chiffrés côté client  
**Sécurité :** Chiffrement AES avant envoi  
**Contenu :**
- Notes médicales privées
- Données de santé critiques

## 🗄️ Schéma de base de données sécurisé

### Table `user_health_data`
```sql
CREATE TABLE user_health_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  birth_date DATE,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  medical_conditions TEXT[],
  encrypted_notes TEXT, -- Chiffré côté client
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS STRICT : Seul le propriétaire peut accéder
ALTER TABLE user_health_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own health data" ON user_health_data
  FOR ALL USING (auth.uid() = user_id);

-- Pas de politique publique = AUCUN accès externe possible
```

## 🛡️ Politiques de sécurité

### ✅ **Ce qui est SÉCURISÉ :**
1. **Métadonnées Auth** - Chiffrées par Supabase
2. **RLS strict** - Un utilisateur = ses données uniquement
3. **Pas de données publiques** - Aucune table accessible sans auth
4. **Séparation des données** - Sensible vs non-sensible
5. **Validation côté serveur** - Contraintes SQL

### 🚫 **Ce qui est INTERDIT :**
1. ❌ Données publiques sans authentification
2. ❌ Politiques RLS permissives
3. ❌ Stockage de données sensibles en clair
4. ❌ Accès cross-utilisateur
5. ❌ Métadonnées pour données sensibles

## 🔧 Migration depuis l'ancien système

### Étapes pour sécuriser :

1. **Supprimer l'ancienne table `profiles`**
```sql
DROP TABLE IF EXISTS profiles CASCADE;
```

2. **Créer la nouvelle structure sécurisée**
```sql
-- Voir SECURE_DATABASE_SETUP.md
```

3. **Migrer les composants**
```js
// Ancien (NON sécurisé)
const profile = useProfileStore()

// Nouveau (SÉCURISÉ)
const auth = useAuthStore() // Pour nom, prénom
const health = useSecureProfileStore() // Pour données sensibles
```

## 📋 Checklist de sécurité

### ✅ **Authentification**
- [x] Confirmation email obligatoire
- [x] Métadonnées utilisateur pour données de base
- [x] Session management automatique

### ✅ **Base de données**
- [x] RLS activé sur toutes les tables
- [x] Politiques restrictives (user_id only)
- [x] Pas de données publiques
- [x] Contraintes de validation SQL

### ✅ **Frontend**
- [x] Stores séparés par niveau de sécurité
- [x] Validation côté client
- [x] Gestion d'erreurs sécurisée

### ✅ **Données sensibles**
- [x] Table séparée pour données de santé
- [x] Chiffrement pour données ultra-sensibles
- [x] Pas d'exposition via API publique

## 🚀 Utilisation sécurisée

```js
// Composant Vue sécurisé
<script setup>
import { useAuthStore } from '@/stores/auth'
import { useSecureProfileStore } from '@/stores/secureProfile'

const auth = useAuthStore()
const health = useSecureProfileStore()

// Données non-sensibles (sécurisées par auth)
const displayName = auth.userFullName

// Données sensibles (RLS strict + validation)
await health.fetchSensitiveData(auth.user.id)
const bmi = health.bmi
</script>
```

## 🔮 Sécurité future

### Extensions sécurisées possibles :
- 🔐 **Chiffrement E2E** pour notes médicales
- 🔑 **2FA** pour accès aux données sensibles  
- 📊 **Audit logs** des accès aux données
- 🛡️ **Rate limiting** sur les API sensibles
- 🔒 **Data masking** pour les exports

---

**⚠️ IMPORTANT :** Cette architecture respecte le RGPD et les meilleures pratiques de sécurité pour les données de santé.
