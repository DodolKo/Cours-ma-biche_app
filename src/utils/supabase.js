import { createClient } from "@supabase/supabase-js";

// Configuration Supabase - Vite utilise import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Vérification des variables d'environnement
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅' : '❌');
  console.error('Vérifiez votre configuration .env ou Netlify');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
        