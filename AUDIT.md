# Audit technique du projet

## Synthese rapide
- Renforcement des controles serveur (validation des URLs Deezer, verifications de role cote Socket.IO, durcissement CORS) pour limiter SSRF et Broken Access Control.
- Refactorisation du front : stores Pinia renommés, corrections des composants critiques (`PlayerList.vue`, `Player.vue`), suppression du composant `Playing.vue` obsolète, introduction de la configuration par variables d'environnement.
- Reste à faire : authentification, protections anti-DDoS, centralisation de la logique temps réel, couverture de tests et durcissement general (helmet, rate limiting, supervision).

## Backend (`back/`)

### Correctifs apportes
- **SSRF (A10) mitige** : les URLs Deezer sont validees/sanitisees avant appel (`utils/validation.js`, `DeezerService`, `GameService`).
- **Broken Access Control (A01)** : chaque action sensible Socket.IO verifie désormais le statut d'hôte coté serveur (`room.handlers.js`, `game.handlers.js`, `RoomService`).
- **Security Misconfiguration (A05)** : CORS parametré via variables d'environnement, origine obligatoire hors dev, options Socket.IO partagees (`config/cors.js`, `server.js`).
- **Intégrité des rooms** : creation et join sanitises, IDs de salle generes par `crypto.randomUUID`, exposé public réduit aux metadonnées (`RoomService`, `room.handlers.js`).
- **Gestion d'erreurs** : handlers Socket.IO encapsules dans des `try/catch`, nouveaux canaux `room:error` / `game:error` pour le client.

### Points restants / améliorations futures
- **AuthN/AuthZ (A07)** : toujours aucune identification utilisateur ni separation forte des privileges (auth de session/jwt à concevoir).
- **Durcissement supplémentaire** : absence de `helmet`, de quotas de requêtes, de journalisation centralisée.
- **Persistence** : l'état des rooms reste en mémoire vive; prévoir un stockage (Redis, base) et des TTL.
- **Gestion des dependances** : mettre en place un suivi (`npm audit`, versions verrouillées) et CI.
- **Tests** : toujours aucune couverture unitaire ou intégration.

## Frontend (`front/`)

### Correctifs apportes
- **Couche Socket.IO** : ecoute des erreurs (`room:error`, `game:error`), diffusion restreinte des rooms (ID + compte joueurs).
- **Stores Pinia** : renommage camelCase (`playerStore`), valeurs par defaut cohérentes, reinitialisation centralisee.
- **Composants critiques** : `Player.vue`, `PlayerList.vue`, `RoomSettings.vue`, `EndingScreen.vue`, `create.vue` corrigés (props, computed setters, DOM direct supprimé, navigation sécurisée).
- **Configuration** : URLs backend/socket injectées via `VITE_API_URL`/`VITE_SOCKET_URL` (`socket.js`, `BlindtestCategories.vue`).
- **Nettoyage** : suppression de `Playing.vue` obsolète, correction des imports et de la liste de salles affichée.

### Points restants / améliorations futures
- **Expérience utilisateur** : afficher les erreurs serveur (`room:error`, `game:error`) dans l'UI (toast/modal) plutôt qu'en console.
- **Sécurité** : toujours pas d'authentification ni de chiffrement TLS côté client; les `socketId` demeurent visibles dans le store (peut être masqué côté UI).
- **Architecture front** : continuer à isoler la logique Socket.IO dans un service, centraliser les fetchs, introduire des types (TS) et tests.
- **Assets** : vérifier la disponibilité et l'obsolescence des assets `/Player/*.png`.

## Recommandations transverses
- Authentifier les joueurs (session/JWT) et renforcer l'autorisation côté serveur.
- Ajouter des protections HTTP (helmet, rate limiting, validation de schémas, logs centralisés).
- Persister l'état (Redis + TTL) et préparer la montée en charge.
- Continuer la factorisation front (services IO, gestion d'erreurs utilisateur, typage) et ajouter des tests automatisés.
- Mettre en place une CI avec audits de dépendances et linting.


