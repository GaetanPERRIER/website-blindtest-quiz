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

## Phase 2 — Refonte & Simplification (Révision) ✅

### 2.1 — Refonte graphique majeure ✅
- Refonte de la page d'accueil (Join.vue), du Lobby, de l'écran de jeu, de la modal de fin de manche et de l'écran de fin.
- Internationalisation complète en anglais.

### 2.2 — Simplification & Sécurisation ✅
- [x] **Suppression de la difficulté** : Le concept de difficulté (easy/medium/hard) a été retiré du front et du back pour simplifier l'expérience.
- [x] **Garde-fou Backend** : Le serveur ne crash plus si une room n'est pas trouvée (gestion d'erreur `getRoom`).
- [x] **Refonte IHM Config** : Interface de configuration du salon simplifiée, suppression des cartes de difficulté, nouveau design type "carte" pour les réglages.
- [x] **Bouton Quitter** : Ajout d'un bouton pour quitter manuellement une room depuis le lobby.
- [x] **Limite de musiques** : Le nombre maximum de pistes par session a été limité à 20 pour garantir des parties rapides et fluides.

---

## Phase 3 — Architecture évolutive ✅

> Complétée

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

## Phase 5 — Spotify + Amis (Suite) ✅

> Complétée

### Migration API musicale

- [x] Remplacer Deezer par Spotify API (previews 30s, playlists, metadata riche)
- [x] Gérer l'auth Spotify côté backend (Client Credentials flow)
- [x] Adapter `deezer.service.js` → `music.service.js` avec interface commune
- [x] Implémenter une recherche de réponse floue (normalization, suppression des parenthèses)

### Système d'amis (Suite)

- [x] Créer `friend.service.js` pour l'intégration Supabase
- [x] Implémenter la recherche d'utilisateurs et les demandes d'amitié
- [x] Gérer le statut en ligne/hors ligne via WebSockets
- [x] **Invitation directe en salon** depuis la liste d'amis → notification WebSocket → rejoindre en un clic

---

## Ordre d'exécution recommandé

```
✅ Phase 0 — Nettoyage          ← DONE
✅ Phase 1 — Design System      ← DONE
✅ Phase 2 — Refonte des écrans   ← DONE
✅ Phase 3 — Architecture       ← DONE
✅ Phase 4 — Auth + Amis (Bases) ← DONE
✅ Phase 5 — Spotify + Amis (Suite) ← DONE
```

---

*Dernière mise à jour : 12 Juin 2026 — Phase 2 optimisée (Ergonomie, Volume persistence, UI fixes, Slider relocated)*
