import { createClient } from "@supabase/supabase-js";

// Configuration Supabase - Vite utilise import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fonction pour créer le client Supabase
function createSupabaseClient() {
  // Vérification des variables d'environnement
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Variables d\'environnement Supabase manquantes:');
    console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
    console.error('VITE_SUPABASE_ANON_KEY:', supabaseKey ? '✅' : '❌');
    console.error('Vérifiez votre configuration .env ou Netlify');
    
    // En mode développement, utiliser des valeurs par défaut pour éviter les erreurs
    if (import.meta.env.DEV) {
      console.warn('⚠️ Mode développement : utilisation de valeurs par défaut');
      const defaultUrl = 'https://placeholder.supabase.co';
      const defaultKey = 'placeholder-key';
      return createClient(defaultUrl, defaultKey);
    } else {
      // En production, lancer une erreur explicite
      throw new Error('Variables d\'environnement Supabase manquantes. Vérifiez la configuration Netlify.');
    }
  } else {
    console.log('✅ Variables d\'environnement Supabase chargées');
    return createClient(supabaseUrl, supabaseKey);
  }
}

// Export du client Supabase
export const supabase = createSupabaseClient();
        