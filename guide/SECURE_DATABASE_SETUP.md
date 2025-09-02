# 🔒 Configuration Base de Données SÉCURISÉE - Running App

## ⚠️ IMPORTANT - Nouvelle Architecture de Sécurité

Cette nouvelle approche respecte les meilleures pratiques de sécurité et les recommandations Supabase.

## 🗑️ Étape 1 : Nettoyer l'ancienne structure (si elle existe)

```sql
-- Supprimer l'ancienne table non-sécurisée
DROP TABLE IF EXISTS profiles CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
```

## 🔐 Étape 2 : Créer la structure sécurisée

### Table pour données de santé SENSIBLES uniquement

```sql
-- Table STRICTEMENT sécurisée pour données sensibles
CREATE TABLE user_health_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  
  -- Données sensibles de santé
  birth_date DATE,
  weight DECIMAL(5,2), -- kg
  height DECIMAL(5,2), -- cm
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  
  -- Conditions médicales (tableau)
  medical_conditions TEXT[] DEFAULT '{}',
  
  -- Notes chiffrées côté client pour données ultra-sensibles
  encrypted_notes TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SÉCURITÉ MAXIMALE : RLS strict
ALTER TABLE user_health_data ENABLE ROW LEVEL SECURITY;

-- POLITIQUE STRICTE : Seul le propriétaire des données peut y accéder
CREATE POLICY "Users can only access their own health data" ON user_health_data
  FOR ALL USING (auth.uid() = user_id);

-- Trigger pour updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER handle_health_data_updated_at
  BEFORE UPDATE ON user_health_data
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

## 📊 Étape 3 : Tables pour données d'activité (futures)

```sql
-- Table pour les courses (données d'activité)
CREATE TABLE user_runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Données de course
  distance DECIMAL(6,2), -- km
  duration INTEGER, -- secondes
  pace DECIMAL(4,2), -- min/km
  calories INTEGER,
  elevation_gain DECIMAL(6,2), -- mètres
  
  -- Métadonnées
  run_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  
  -- Données GPS (optionnel, chiffré)
  encrypted_route_data TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS pour les courses
ALTER TABLE user_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own runs" ON user_runs
  FOR ALL USING (auth.uid() = user_id);

-- Index pour performance
CREATE INDEX idx_user_runs_user_id_date ON user_runs(user_id, run_date DESC);
```

## 🎯 Étape 4 : Tables pour objectifs

```sql
-- Table pour les objectifs personnels
CREATE TABLE user_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Objectif
  title TEXT NOT NULL,
  description TEXT,
  goal_type TEXT CHECK (goal_type IN ('distance', 'time', 'weight_loss', 'races', 'custom')),
  
  -- Valeurs
  target_value DECIMAL(10,2),
  current_value DECIMAL(10,2) DEFAULT 0,
  unit TEXT, -- 'km', 'minutes', 'kg', etc.
  
  -- Dates
  target_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Statut
  is_active BOOLEAN DEFAULT TRUE,
  is_completed BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS pour les objectifs
ALTER TABLE user_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own goals" ON user_goals
  FOR ALL USING (auth.uid() = user_id);

-- Trigger updated_at
CREATE TRIGGER handle_goals_updated_at
  BEFORE UPDATE ON user_goals
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

## 🔍 Étape 5 : Vérifications de sécurité

```sql
-- Vérifier que RLS est activé sur toutes les tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user_health_data', 'user_runs', 'user_goals');

-- Vérifier les politiques
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';

-- Test de sécurité (doit retourner 0 lignes si non connecté)
SELECT COUNT(*) FROM user_health_data; -- Doit être 0 sans auth
```

## 📋 Étape 6 : Configuration des métadonnées Auth

Les données NON-SENSIBLES sont stockées dans `auth.users.user_metadata` :

```json
{
  "first_name": "Jean",
  "last_name": "Dupont", 
  "display_name": "Jean D.",
  "avatar_url": "https://...",
  "preferences": {
    "units": "metric",
    "language": "fr"
  }
}
```

## 🛡️ Niveaux de sécurité implémentés

### 🔓 **Niveau 1 : Données publiques/affichage**
- **Stockage :** `auth.users.user_metadata`
- **Accès :** Utilisateur uniquement
- **Chiffrement :** Automatique par Supabase
- **Contenu :** Nom, prénom, avatar, préférences

### 🔒 **Niveau 2 : Données de santé sensibles**
- **Stockage :** `user_health_data`
- **Accès :** RLS strict (user_id only)
- **Chiffrement :** Base de données + connexion
- **Contenu :** Poids, taille, âge, conditions médicales

### 🔐 **Niveau 3 : Données ultra-sensibles**
- **Stockage :** Champs `encrypted_*`
- **Accès :** RLS + chiffrement côté client
- **Chiffrement :** AES-256 avant envoi
- **Contenu :** Notes médicales, données GPS précises

## ✅ Checklist de vérification

Après avoir exécuté ces scripts :

- [ ] ✅ Tables créées avec RLS activé
- [ ] ✅ Politiques restrictives en place
- [ ] ✅ Triggers de mise à jour fonctionnels
- [ ] ✅ Index de performance créés
- [ ] ✅ Aucune donnée accessible sans authentification
- [ ] ✅ Test de sécurité passé

## 🚀 Prêt pour la production

Cette architecture garantit :
- 🔒 **Confidentialité** - Données personnelles protégées
- 🛡️ **Intégrité** - Validation et contraintes SQL
- 🔐 **Disponibilité** - Performance optimisée
- 📋 **Conformité** - RGPD et meilleures pratiques

---

**⚠️ IMPORTANT :** Redémarrez votre application Vue après avoir créé ces tables !
