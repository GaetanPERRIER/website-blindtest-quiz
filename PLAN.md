# BeatQuiz — Plan de développement

> Blindtest multijoueur en temps réel · Vue 3 + Express.js + Socket.IO + Supabase

---

## Vision du produit

**BeatQuiz** est un jeu de blindtest musical multijoueur en ligne. Les joueurs rejoignent des salons sur invitation, devinent des extraits musicaux en temps réel, et s'affrontent sur un classement. Le projet a vocation à évoluer vers une plateforme multi-modes avec comptes utilisateurs, système d'amis et intégration Spotify pour un usage commercial.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Frontend | Vue 3 + Vite |
| State management | Pinia |
| Routing | Vue Router |
| Styles | SCSS (Design System custom) |
| Temps réel | Socket.IO |
| Backend | Node.js + Express 5 |
| Base de données *(futur)* | Supabase (PostgreSQL managé) |
| Auth *(futur)* | Supabase Auth (Google OAuth) |
| API musicale (actuelle) | Deezer API |
| API musicale *(future)* | Spotify API (usage commercial) |

---

## Décisions d'architecture

### Base de données — Supabase

**Choix retenu : Supabase**

- PostgreSQL managé, pas de serveur à maintenir
- Auth Google intégrée nativement (OAuth)
- Gratuit jusqu'à 50 000 utilisateurs actifs/mois
- Plan Pro à 25$/mois pour 100 000 MAU
- Au-delà : $0.00325 par MAU supplémentaire
- ⚠️ Seule contrainte : mise en pause après 1 semaine d'inactivité sur le free tier

**Schéma BDD prévu (futur)**

```
users           — id, google_id, username, avatar_url, created_at
friendships     — user_id, friend_id, status (pending/accepted), created_at
game_sessions   — id, room_id, mode, settings, created_at
game_results    — session_id, user_id, score, rank, created_at
```

### Règles métier

- **Salons sur invitation uniquement** — pas de room publique rejoignable librement
- Lien d'invitation via URL `?roomId=` + bouton "Copy invite link" dans le lobby
- Maximum 6 joueurs par salon
- *(Futur)* Invitations directes via la liste d'amis

### Langue

- Interface entièrement en **anglais**
- Labels UI, événements Socket, commentaires de code → anglais

---

## Phase 0 — Nettoyage & Base saine ✅

> Complétée

### Fichiers supprimés

- [x] `front/src/views/home.vue` + tous les composants `front/src/components/Home/`
- [x] `front/src/components/Blindtest/Game/Playing/Playing-delete.vue`
- [x] `front/src/stores/musicStore.js` *(logique migrée dans playerStore)*
- [x] `front/.nuxt/` *(artefact Nuxt)*
- [x] `front/src/assets/main.css` + `front/src/assets/base.css` *(boilerplate Vue)*
- [x] `front/src/assets/styles/styles.css` *(CSS compilé, ajouté au .gitignore)*

### Dépendances backend désinstallées

- [x] `node-fetch`
- [x] `socket.io-client` côté backend

### Bugs corrigés

- [x] Créé `front/src/assets/styles/theme/img.scss`
- [x] Difficulté alignée : `normal` → `medium` dans `game.service.js`
- [x] `Player.vue` : `const props = defineProps(...)` corrigé
- [x] `ejectPlayer` handler : null check ajouté
- [x] `startBlindtest` retiré de `server.js`
- [x] `joinRoom` : `gameStarted` remplacé par `room.state !== 'config'`
- [x] Tous les `console.log` de debug supprimés
- [x] `musicStore` migré dans `playerStore` (`categories` + `setCategories`)

### Variables d'environnement

- [x] `front/.env` + `front/.env.example` créés
- [x] `back/.env` + `back/.env.example` créés
- [x] `constants.js` lit `process.env.PORT`, `CLIENT_URL`, `DEEZER_API_BASE`
- [x] `socket.js` utilise `VITE_SOCKET_URL`
- [x] `BlindtestCategories.vue` utilise `VITE_API_URL`
- [x] `front/.gitignore` mis à jour (`.env`, `styles.css`)

### Passage en anglais

- [x] `index.html` : `lang="en"`, `<title>BeatQuiz</title>`
- [x] Toutes les actions du `playerStore` renommées en camelCase anglais
- [x] Tous les labels UI traduits (boutons, placeholders, messages d'erreur, titres)
- [x] Commentaires FR supprimés dans le backend
- [x] `InviteButton`, `RoomSettings`, `BlindtestCategories`, `PlayerList`, `Guessing`, `ModalRoundOver`, `EndingScreen` → anglais

---

## Phase 1 — Identité visuelle & Design System

> Durée estimée : 2-3h · **EN COURS**

### Branding BeatQuiz

- [x] Logo SVG : icône casque + notes musicales (gradient FF6E6E → FFDF6B)
- [x] Favicon SVG optimisé (32x32 px)
- [x] Tagline défini : "Guess the song. Beat your friends."
- [x] Meta tags et branding dans `index.html`

### Refonte du Design System SCSS

**Tokens définis dans `settings.scss`** ✅

```scss
// Couleurs principales
$color-primary-gradient: linear-gradient(135deg, #FF6E6E 0%, #FFDF6B 100%);
$color-surface: rgba(255, 255, 255, 0.1);
$color-surface-hover: rgba(255, 255, 255, 0.15);
$color-surface-active: rgba(255, 255, 255, 0.2);
$color-border: rgba(255, 255, 255, 0.2);
$color-border-hover: rgba(255, 255, 255, 0.3);
$color-accent: #FFBB33;
$color-text: #ffffff;
$color-text-muted: rgba(255, 255, 255, 0.6);
$color-text-light: rgba(255, 255, 255, 0.4);

// Couleurs joueurs (6 slots)
$player-colors: (#FF6B6B, #4ECDC4, #A29BFE, #FFEAA7, #FD79A8, #55EFC4);

// Couleurs sémantiques
$color-success: #55EFC4;
$color-warning: #FFBB33;
$color-danger: #FF6B6B;
$color-info: #A29BFE;

// Typographie (échelle)
$font-size-xs: 11px;
$font-size-sm: 13px;
$font-size-base: 15px;
$font-size-lg: 18px;
$font-size-xl: 22px;
$font-size-2xl: 28px;
$font-size-3xl: 36px;

// Espacement
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 12px;
$spacing-lg: 16px;
$spacing-xl: 24px;
$spacing-2xl: 32px;
$spacing-3xl: 48px;

// Ombres & blur
$shadow-sm/md/lg/xl, $blur-sm/md/lg

// Durées d'animation
$duration-fast: 150ms;
$duration-normal: 300ms;
$duration-slow: 500ms;
```

### 3 variantes de boutons — `buttons.scss` ✅

| Variante | Usage | Style |
|---|---|---|
| `btn-primary` | CTA principal (Start, Create) | Gradient chaud + ombre forte |
| `btn-secondary` | Actions secondaires (Cancel, Back) | Glassmorphism + border |
| `btn-ghost` | Actions tertiaires (Copy link) | Transparent + border fine |

**Fichiers créés :**
- [x] `front/public/beatquiz-logo.svg` (48x48)
- [x] `front/public/beatquiz-favicon.svg` (32x32)
- [x] `front/src/assets/styles/theme/logo.scss`
- [x] `BRANDING.md` — Documentation complète du Design System

**Fichiers modifiés :**
- [x] `front/src/assets/styles/settings/settings.scss` — Tokens BeatQuiz
- [x] `front/src/assets/styles/theme/buttons.scss` — 3 variantes
- [x] `front/src/assets/styles/styles.scss` — Import logo.scss
- [x] `front/index.html` — Favicon SVG + meta tags

---

## Phase 2 — Refonte des écrans

### 2.1 — Page d'accueil (`Join.vue`)

> Ex `create.vue` · Durée estimée : 1h

**Nouveautés :**
- [ ] Header centré avec logo BeatQuiz
- [ ] Tagline : *"Guess the song. Beat your friends."*
- [ ] Affichage adapté selon contexte :
  - Sans `?roomId=` → bouton "Create a lobby"
  - Avec `?roomId=` → "You've been invited · Join as [pseudo]"
- [ ] Supprimer l'affichage de la liste des rooms *(mode invite-only)*
- [ ] Animation d'entrée soignée

### 2.2 — Lobby (`Lobby.vue`)

> Ex `GameConfig` + `RoomSettings` · Durée estimée : 2-3h

**Nouveautés :**
- [ ] Header du lobby : nom de la room + **bouton "Copy invite link"** avec feedback animé (✓ Copied!)
- [ ] Grille de catégories : cards avec image Deezer, nom, état sélectionné bien visible
- [ ] Boutons difficulté redessinés avec description :
  - `Easy` — 30s per round
  - `Medium` — 20s per round
  - `Hard` — 15s per round
- [ ] Slider morceaux avec badge de valeur
- [ ] Liste joueurs avec **avatar coloré** (initiale + couleur unique par slot)
- [ ] Bouton "Start Game" : `btn-primary`, grand, centré, visible uniquement pour le host
- [ ] Joueurs non-host : message "Waiting for host to start..."
- [ ] Badge host (couronne) sur le joueur concerné

### 2.3 — Écran de jeu (`Guessing.vue`)

> Durée estimée : 2h

**Nouveautés :**
- [ ] Timer agrandi (140px), **effet pulsation** dans les 5 dernières secondes
- [ ] Indication de la catégorie jouée en header
- [ ] Visualiseur audio : 12-15 barres, variation de hauteur plus marquée
- [ ] Zone joueurs : **avatars colorés avec initiales** (pas juste des dots), animation check à la réponse
- [ ] Fond légèrement plus sombre/intense pendant la phase de guessing
- [ ] Input de réponse : plus large, feedback visuel fort

### 2.4 — Modal fin de manche — Refonte majeure

> Durée estimée : 3-4h · Impact visuel le plus fort

**Animation séquencée :**

1. **Révélation de la chanson** — pochette d'album floue → nette, titre + artiste avec slide-in
2. **Podium animé** — cartes avec délai décalé + bounce, confettis légers sur la 1ère place
3. **Liste complète** des joueurs avec score du round (pas seulement top 3)
4. **Barre de progression** de la partie "Round 3 / 8"
5. **Countdown** "Next round in 5s..." avec barre de progression

### 2.5 — Écran de fin (`EndingScreen.vue`)

> Durée estimée : 2h

**Nouveautés :**
- [ ] Animation confettis CSS au chargement
- [ ] **Podium visuel** format olympique (colonnes de hauteurs différentes) avec avatars colorés
- [ ] Liste scrollable du classement complet
- [ ] Stats redessinées : cards glassmorphism avec icônes SVG (supprimer les émojis dans les titres)
- [ ] Deux boutons cohérents : **"Play Again"** (`btn-primary`) + **"Back to Home"** (`btn-secondary`)
- [ ] Ambiance visuelle or si le joueur local est 1er

---

## Phase 3 — Architecture évolutive

> Durée estimée : 1-2h

### Structure backend cible

```
back/
├── config/
│   ├── cors.js
│   ├── constants.js
│   └── db.js              ← placeholder Supabase (vide pour l'instant)
├── middleware/
│   └── auth.js            ← placeholder JWT middleware (vide pour l'instant)
├── models/                ← à créer lors de l'intégration Supabase
│   ├── User.js
│   └── GameSession.js
├── routes/
│   └── deezer.routes.js   ← séparer routes et controllers
├── controllers/
│   └── deezer.controller.js
├── services/
│   ├── deezer.service.js
│   ├── game.service.js
│   └── room.service.js
└── sockets/
    ├── connection.js
    ├── room.handlers.js
    └── modes/
        └── classic.handlers.js  ← déplacer game.handlers.js ici
```

### Architecture multi-modes de jeu

Le système de rooms évolue pour supporter plusieurs modes :

```
room.mode  — "classic" | "speedrun" | "battle" | ...
room.state — "config" | "guessing" | "answer" | "ended"
```

**Modes envisagés (futur) :**
- `classic` — mode actuel, deviner le titre
- `speedrun` — le plus rapide à deviner X chansons gagne
- `battle` — élimination par rounds
- `artist` — deviner l'artiste uniquement

---

## Phase 4 — Auth Google + Système d'amis *(futur)*

> Hors scope immédiat — architecture anticipée

### Intégration Supabase Auth

- [ ] Installer `@supabase/supabase-js` côté frontend
- [ ] Configurer Google OAuth dans le dashboard Supabase
- [ ] Remplacer la saisie de pseudo par "Sign in with Google"
- [ ] Stocker le token JWT dans le store Pinia
- [ ] Transmettre le token dans les headers Socket.IO pour authentifier les connexions

### Système d'amis

- [ ] Page profil utilisateur (avatar, pseudo, stats)
- [ ] Recherche d'utilisateurs par pseudo
- [ ] Demandes d'amitié (envoi, acceptation, refus)
- [ ] Liste d'amis en ligne / hors ligne
- [ ] **Invitation directe en salon** depuis la liste d'amis → notification WebSocket → rejoindre en un clic

### Migration API musicale

- [ ] Remplacer Deezer par Spotify API (previews 30s, playlists, metadata riche)
- [ ] Gérer l'auth Spotify côté backend (Client Credentials flow)
- [ ] Adapter `deezer.service.js` → `music.service.js` avec interface commune

---

## Ordre d'exécution recommandé

```
✅ Phase 0 — Nettoyage          ← DONE
⏳ Phase 1 — Design System      (2-3h)   ← EN COURS
⬜ Phase 2.1 — Join page        (1h)
⬜ Phase 2.2 — Lobby            (2-3h)
⬜ Phase 2.3 — Guessing         (2h)
⬜ Phase 2.4 — Modal round over (3-4h)   ← impact visuel maximum
⬜ Phase 2.5 — Ending screen    (2h)
⬜ Phase 3 — Architecture       (1-2h)
⬜ Phase 4 — Auth + Amis        (futur)
```

---

*Dernière mise à jour : 12 Juin 2026 — Phase 1 en cours*

*Dernière mise à jour : 11 Juin 2026 — Phase 0 complétée*
