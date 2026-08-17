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
| Base de données | Supabase (PostgreSQL managé) — voir `DATABASE.md` |
| Auth | Supabase Auth (Google OAuth) |
| API musicale | Spotify API (playlists + métadonnées) + iTunes (fallback preview audio), tout synchronisé en base — pas d'appel live pendant une partie |

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

**Schéma BDD actuel** : `profiles`, `roles`, `friendships`, `playlists`, `songs`, `playlist_songs` — voir le détail complet (DDL + RLS) dans `DATABASE.md`.

### Règles métier

- **Salons sur invitation uniquement** — pas de room publique rejoignable librement
- Lien d'invitation via URL `?roomId=` + bouton "Copy invite link" dans le lobby
- Maximum 6 joueurs par salon
- *(Futur)* Invitations directes via la liste d'amis

### Langue

- Interface entièrement en **anglais**
- Labels UI, événements Socket, commentaires de code → anglais

---

## Architecture backend

Le découpage en couches route → controller → service → repository est en place pour les domaines `auth` et `music` (backoffice). Les domaines temps réel (`game`, `room`, sockets) restent volontairement en services simples, sans couche repository, car leur état est en mémoire (non persisté) — pas de HTTP/REST à découper.

```
back/
├── config/          → cors.js, constants.js, db.js (client Supabase)
├── middleware/       → auth.js (requireAuth/optionalAuth), admin.js (requireAdmin)
├── routes/          → auth.routes.js, music.routes.js
├── controllers/      → auth.controller.js, music.controller.js
├── repositories/     → profile.repository.js, role.repository.js, music.repository.js
├── services/
│   ├── auth.service.js     → couche complète (Supabase Auth + Google OAuth)
│   ├── music.service.js    → couche complète (sync Spotify + iTunes → Supabase)
│   ├── game.service.js     → service temps réel, état de partie
│   └── room.service.js     → service temps réel, état des salons (en mémoire)
└── sockets/
    ├── connection.js
    ├── room.handlers.js
    └── modes/
        └── classic.handlers.js
```

### Architecture multi-modes de jeu

Le système de rooms est pensé pour supporter plusieurs modes à terme :

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

## Suivi des tâches

Le détail des tâches (terminées, en cours, à faire) est suivi dans le Notion du projet, pas dans ce fichier — évite d'avoir deux sources de vérité qui divergent. Ce document sert uniquement de référence pour la vision produit et les décisions d'architecture.
