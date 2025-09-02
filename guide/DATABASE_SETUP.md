# 🗄️ Configuration Base de Données Supabase - Running App

## 📋 Étapes à suivre dans votre Dashboard Supabase

### 1. 🔧 Créer la table `profiles`

Allez dans **SQL Editor** de votre dashboard Supabase et exécutez ce script :

```sql
-- Créer la table profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  birth_date DATE,
  weight DECIMAL(5,2), -- en kg (ex: 70.5)
  height DECIMAL(5,2), -- en cm (ex: 175.0)
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  running_goals TEXT[], -- tableau de goals (ex: ['lose_weight', 'marathon'])
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activer RLS (Row Level Security) pour la sécurité
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politique : les utilisateurs peuvent voir et modifier leur propre profil
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updated_at
CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

### 2. ✅ Vérifier la création

Après avoir exécuté le script, vérifiez que :
- ✅ La table `profiles` est créée dans l'onglet **Table Editor**
- ✅ Les politiques RLS sont actives
- ✅ Les triggers fonctionnent

## 📊 Structure de la table `profiles`

| Colonne | Type | Description | Obligatoire |
|---------|------|-------------|-------------|
| `id` | UUID | ID utilisateur (référence auth.users) | ✅ |
| `email` | TEXT | Email de l'utilisateur | ✅ |
| `first_name` | TEXT | Prénom | ❌ |
| `last_name` | TEXT | Nom de famille | ❌ |
| `birth_date` | DATE | Date de naissance | ❌ |
| `weight` | DECIMAL(5,2) | Poids en kg | ❌ |
| `height` | DECIMAL(5,2) | Taille en cm | ❌ |
| `gender` | TEXT | Genre (male/female/other) | ❌ |
| `activity_level` | TEXT | Niveau d'activité | ❌ |
| `running_goals` | TEXT[] | Objectifs de course (tableau) | ❌ |
| `created_at` | TIMESTAMP | Date de création | ✅ (auto) |
| `updated_at` | TIMESTAMP | Dernière modification | ✅ (auto) |

## 🔮 Extensions futures possibles

### Tables additionnelles que vous pourrez ajouter :

#### 🏃 Table `runs` (Courses)
```sql
CREATE TABLE runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  distance DECIMAL(6,2), -- en km
  duration INTEGER, -- en secondes
  pace DECIMAL(4,2), -- en min/km
  calories INTEGER,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  route_data JSONB -- pour stocker les données GPS
);
```

#### 🎯 Table `goals` (Objectifs personnalisés)
```sql
CREATE TABLE goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_value DECIMAL(10,2),
  current_value DECIMAL(10,2) DEFAULT 0,
  unit TEXT, -- 'km', 'minutes', 'runs', etc.
  target_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 👥 Table `friendships` (Amis)
```sql
CREATE TABLE friendships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  friend_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'blocked')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, friend_id)
);
```

## 🔒 Sécurité (RLS)

La **Row Level Security** est activée, ce qui signifie que :
- ✅ Chaque utilisateur ne peut voir que son propre profil
- ✅ Aucun utilisateur ne peut accéder aux données d'un autre
- ✅ Les données sont protégées automatiquement

## 🚀 Prêt à utiliser !

Une fois ce script exécuté, votre application Vue 3 pourra :
- ✅ Créer des profils utilisateur
- ✅ Modifier les informations personnelles
- ✅ Stocker poids, taille, âge, etc.
- ✅ Calculer l'IMC automatiquement
- ✅ Gérer les niveaux d'activité

**Note :** N'oubliez pas de redémarrer votre application Vue après avoir créé la table !
