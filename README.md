# 🎵 BeatQuiz

Jeu de blindtest musical multijoueur en temps réel. Les joueurs rejoignent un salon sur invitation, devinent des extraits musicaux, et s'affrontent sur un classement.

## ✨ Fonctionnalités

- **Multijoueur en temps réel** via WebSockets (Socket.IO), jusqu'à 6 joueurs par salon
- **Salons sur invitation** — lien de partage, pas de room publique
- **Comptes utilisateurs** via Google OAuth (Supabase Auth) + système d'amis
- **Backoffice admin** pour gérer les playlists jouables (sync Spotify + preview audio iTunes en fallback, stockées en base)
- **Scoring** basé sur la rapidité de réponse

## 🏗️ Architecture

- **Frontend** : Vue 3 (Composition API) + Vite + Pinia + SCSS
- **Backend** : Node.js + Express 5 + Socket.IO
- **Base de données** : Supabase (PostgreSQL managé)
- **Musique** : Spotify API pour les playlists/métadonnées, iTunes en fallback pour les extraits audio — tout est synchronisé en base, le jeu ne dépend pas d'appels Spotify en temps réel

Détails : voir `PLAN.md` (vision produit, décisions d'architecture) et `DATABASE.md` (schéma Supabase).

## 🚀 Démarrage

### Prérequis
- Node.js (v18+)
- Un projet [Supabase](https://supabase.com/)
- Des credentials Spotify (Client ID/Secret) pour le backoffice

### Installation

```bash
git clone https://github.com/GaetanPERRIER/website-blindtest-quiz.git
cd website-blindtest-quiz

# Backend
cd back && npm install

# Frontend
cd ../front && npm install
```

### Configuration Supabase

1. Créez un projet sur [Supabase](https://supabase.com/)
2. Dans **SQL Editor**, exécutez les requêtes du fichier `DATABASE.md` (tables `roles`, `profiles`, `friendships`, `playlists`, `songs`, `playlist_songs` + policies RLS)
3. Configurez Google OAuth (**Auth > Providers**) — voir la section dédiée dans `DATABASE.md`
4. Récupérez vos clés API depuis **Settings > API**

### Variables d'environnement

Copiez `.env.example` → `.env` dans `back/` et dans `front/`, puis remplissez les valeurs (Supabase, Spotify, URLs).

### Lancement

```bash
# Terminal 1 — Backend
cd back
node server.js

# Terminal 2 — Frontend
cd front
npm run dev
```

L'application est accessible sur `http://localhost:5173`.

## 📁 Structure du projet

```
website-blindtest-quiz/
├── back/            # API REST + WebSockets (Node/Express/Socket.IO)
├── front/           # Application Vue 3
├── PLAN.md          # Vision produit & décisions d'architecture
├── DATABASE.md      # Schéma Supabase (DDL + RLS)
└── BRANDING.md      # Design system (tokens, composants UI)
```

## 🛠️ Stack

**Backend** : Node.js, Express 5, Socket.IO, Supabase JS, Spotify Web API
**Frontend** : Vue 3, Vite, Pinia, Vue Router, SCSS, Socket.IO Client
