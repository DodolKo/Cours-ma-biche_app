# 🚀 Instructions de configuration - Running App

## ⚠️ Configuration Supabase OBLIGATOIRE

Votre application ne fonctionnera pas sans cette étape !

### 1. Créer le fichier .env

Créez un fichier `.env` à la racine de votre projet (`/home/dodol/Cepegra/runing_app_project/front_end/running_app/.env`) avec ce contenu :

```bash
# Configuration Supabase - REMPLACEZ PAR VOS VRAIES VALEURS
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anonyme-ici
```

### 2. Obtenir vos clés Supabase

1. **Allez sur [supabase.com](https://supabase.com)**
2. **Connectez-vous** à votre compte
3. **Sélectionnez votre projet** (ou créez-en un nouveau)
4. **Allez dans Settings > API**
5. **Copiez :**
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

### 3. Activer l'authentification dans Supabase

1. **Dans votre dashboard Supabase**
2. **Allez dans Authentication > Settings**
3. **Activez "Enable email confirmations"** si vous voulez la confirmation par email
4. **Configurez les URLs de redirection** si nécessaire

### 4. Redémarrer le serveur de développement

```bash
# Arrêtez le serveur (Ctrl+C) puis relancez :
npm run dev
```

## ✅ Vérification

Une fois configuré, vous devriez voir :
- ✅ Plus d'erreur "supabaseKey is required"
- ✅ Le formulaire d'authentification fonctionne
- ✅ Vous pouvez créer un compte et vous connecter

## 🆘 En cas de problème

Si vous avez encore des erreurs :

1. **Vérifiez que le fichier .env est bien à la racine**
2. **Vérifiez que les variables commencent par VITE_**
3. **Redémarrez complètement le serveur**
4. **Vérifiez vos clés Supabase dans le dashboard**

---

**Note :** Le fichier `.env` est déjà dans le `.gitignore` pour votre sécurité.
