-- =============================================
-- Schéma Supabase pour Running App - Programmes
-- =============================================

-- Table des programmes de course
CREATE TABLE training_programs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  total_weeks INTEGER NOT NULL DEFAULT 8,
  phases JSONB NOT NULL, -- Structure des phases par semaine/jour
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de progression utilisateur
CREATE TABLE user_training_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID REFERENCES training_programs(id) ON DELETE CASCADE,
  current_week INTEGER NOT NULL DEFAULT 1,
  current_day INTEGER NOT NULL DEFAULT 1,
  completed_sessions JSONB DEFAULT '[]', -- Historique des sessions complétées
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Activer RLS sur toutes les tables
ALTER TABLE training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_training_progress ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité
CREATE POLICY "Programs are public" ON training_programs 
  FOR SELECT USING (true);

CREATE POLICY "Users can only access their own progress" ON user_training_progress 
  FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- DONNÉES D'EXEMPLE
-- =============================================

-- Programme d'exemple : "Débuter la course - 4 semaines"
INSERT INTO training_programs (name, description, total_weeks, phases) VALUES (
  'Débuter la course - 4 semaines',
  'Programme progressif pour débuter la course à pied en douceur',
  4,
  '{
    "week_1": {
      "day_1": [
        {"type": "warmup", "duration": 5, "description": "Échauffement léger - marche lente"},
        {"type": "walk", "duration": 10, "description": "Marche à rythme modéré"},
        {"type": "stretch", "duration": 5, "description": "Étirements de récupération"}
      ],
      "day_2": [
        {"type": "warmup", "duration": 5, "description": "Échauffement"},
        {"type": "walk", "duration": 8, "description": "Marche rapide"},
        {"type": "run", "duration": 2, "description": "Course très lente - 2 minutes"},
        {"type": "walk", "duration": 5, "description": "Récupération en marchant"},
        {"type": "stretch", "duration": 5, "description": "Étirements"}
      ],
      "day_3": [
        {"type": "warmup", "duration": 5, "description": "Échauffement"},
        {"type": "walk", "duration": 6, "description": "Marche"},
        {"type": "run", "duration": 4, "description": "Course légère - 4 minutes"},
        {"type": "stretch", "duration": 5, "description": "Étirements"}
      ]
    },
    "week_2": {
      "day_1": [
        {"type": "warmup", "duration": 5, "description": "Échauffement"},
        {"type": "walk", "duration": 6, "description": "Marche"},
        {"type": "run", "duration": 6, "description": "Course - 6 minutes"},
        {"type": "stretch", "duration": 5, "description": "Étirements"}
      ],
      "day_2": [
        {"type": "warmup", "duration": 5, "description": "Échauffement"},
        {"type": "walk", "duration": 4, "description": "Marche"},
        {"type": "run", "duration": 8, "description": "Course - 8 minutes"},
        {"type": "stretch", "duration": 5, "description": "Étirements"}
      ],
      "day_3": [
        {"type": "warmup", "duration": 5, "description": "Échauffement"},
        {"type": "walk", "duration": 3, "description": "Marche"},
        {"type": "run", "duration": 10, "description": "Course - 10 minutes"},
        {"type": "stretch", "duration": 5, "description": "Étirements"}
      ]
    },
    "week_3": {
      "day_1": [
        {"type": "warmup", "duration": 5, "description": "Échauffement"},
        {"type": "walk", "duration": 3, "description": "Marche"},
        {"type": "run", "duration": 12, "description": "Course - 12 minutes"},
        {"type": "stretch", "duration": 5, "description": "Étirements"}
      ],
      "day_2": [
        {"type": "warmup", "duration": 5, "description": "Échauffement"},
        {"type": "walk", "duration": 2, "description": "Marche"},
        {"type": "run", "duration": 15, "description": "Course - 15 minutes"},
        {"type": "stretch", "duration": 5, "description": "Étirements"}
      ],
      "day_3": [
        {"type": "warmup", "duration": 5, "description": "Échauffement"},
        {"type": "walk", "duration": 2, "description": "Marche"},
        {"type": "run", "duration": 18, "description": "Course - 18 minutes"},
        {"type": "stretch", "duration": 5, "description": "Étirements"}
      ]
    },
    "week_4": {
      "day_1": [
        {"type": "warmup", "duration": 5, "description": "Échauffement"},
        {"type": "walk", "duration": 2, "description": "Marche"},
        {"type": "run", "duration": 20, "description": "Course - 20 minutes"},
        {"type": "stretch", "duration": 5, "description": "Étirements"}
      ],
      "day_2": [
        {"type": "warmup", "duration": 5, "description": "Échauffement"},
        {"type": "walk", "duration": 1, "description": "Marche"},
        {"type": "run", "duration": 25, "description": "Course - 25 minutes"},
        {"type": "stretch", "duration": 5, "description": "Étirements"}
      ],
      "day_3": [
        {"type": "warmup", "duration": 5, "description": "Échauffement"},
        {"type": "run", "duration": 30, "description": "Course continue - 30 minutes"},
        {"type": "stretch", "duration": 5, "description": "Étirements"}
      ]
    }
  }'::jsonb
);

-- Programme intermédiaire
INSERT INTO training_programs (name, description, total_weeks, phases) VALUES (
  'Course intermédiaire - 6 semaines',
  'Programme pour coureurs ayant déjà une base',
  6,
  '{
    "week_1": {
      "day_1": [
        {"type": "warmup", "duration": 5, "description": "Échauffement dynamique"},
        {"type": "run", "duration": 20, "description": "Course continue - 20 minutes"},
        {"type": "stretch", "duration": 10, "description": "Étirements complets"}
      ],
      "day_2": [
        {"type": "warmup", "duration": 5, "description": "Échauffement"},
        {"type": "run", "duration": 25, "description": "Course - 25 minutes"},
        {"type": "stretch", "duration": 10, "description": "Étirements"}
      ],
      "day_3": [
        {"type": "warmup", "duration": 5, "description": "Échauffement"},
        {"type": "run", "duration": 30, "description": "Course - 30 minutes"},
        {"type": "stretch", "duration": 10, "description": "Étirements"}
      ]
    }
  }'::jsonb
);

-- =============================================
-- INDEX POUR LES PERFORMANCES
-- =============================================

-- Index sur user_id pour les requêtes de progression
CREATE INDEX idx_user_training_progress_user_id ON user_training_progress(user_id);
CREATE INDEX idx_user_training_progress_program_id ON user_training_progress(program_id);
CREATE INDEX idx_user_training_progress_active ON user_training_progress(is_active) WHERE is_active = true;

-- Index sur les programmes publics
CREATE INDEX idx_training_programs_public ON training_programs(is_public) WHERE is_public = true;

-- =============================================
-- FONCTIONS UTILITAIRES
-- =============================================

-- Fonction pour calculer le pourcentage de progression
CREATE OR REPLACE FUNCTION calculate_progress_percentage(progress_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_sessions INTEGER;
  completed_sessions INTEGER;
  percentage INTEGER;
BEGIN
  -- Récupérer le nombre total de sessions du programme
  SELECT COUNT(*) INTO total_sessions
  FROM training_programs tp, jsonb_each(tp.phases) as week_data
  WHERE tp.id = (SELECT program_id FROM user_training_progress WHERE id = progress_id);
  
  -- Récupérer le nombre de sessions complétées
  SELECT jsonb_array_length(completed_sessions) INTO completed_sessions
  FROM user_training_progress
  WHERE id = progress_id;
  
  -- Calculer le pourcentage
  IF total_sessions > 0 THEN
    percentage := (completed_sessions * 100) / total_sessions;
  ELSE
    percentage := 0;
  END IF;
  
  RETURN percentage;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- COMMENTAIRES
-- =============================================

COMMENT ON TABLE training_programs IS 'Programmes d''entraînement de course disponibles';
COMMENT ON TABLE user_training_progress IS 'Progression des utilisateurs dans leurs programmes';
COMMENT ON COLUMN training_programs.phases IS 'Structure JSON des phases par semaine et jour';
COMMENT ON COLUMN user_training_progress.completed_sessions IS 'Historique JSON des sessions complétées';
COMMENT ON FUNCTION calculate_progress_percentage IS 'Calcule le pourcentage de progression d''un utilisateur';
