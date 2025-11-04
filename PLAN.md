## Plan de mise en œuvre des nouvelles fonctionnalités Blindtest

### 1. Analyse et préparation
- [x] Cartographier les flux actuels de réponses côté serveur (`back/services/game.service.js`) et client (`front/src/components/Blindtest/Game/Playing/InputAnswer.vue`).
- [x] Vérifier les structures de données échangées via Socket.IO (`back/sockets/game.handlers.js`, store `playerStore`).

### 2. Détection améliorée des réponses
- [x] Introduire une étape de normalisation commune (trim, accents, ponctuation, parenthèses) côté serveur pour les titres/artistes attendus et les réponses joueurs (`back/utils/answer-utils.js`).
- [x] Implémenter une comparaison flexible :
  - [x] Permettre la validation partielle (titre seul, artiste seul, ou combinaison) en identifiant chaque composant.
  - [x] Ajouter une tolérance aux fautes via une mesure de distance (type Levenshtein) avec seuil ajustable selon la longueur du mot.
- [x] Adapter `checkAnswer` pour retourner le détail de la correspondance (titre trouvé, artiste trouvé, score attribué, temps de réponse, etc.).
- [x] Propager les informations côté client pour afficher le feedback adéquat (mise à jour du store + écouteur `answerEvaluation`).
- [ ] Prévoir un retour visuel côté client (feedback/notifications) pour les joueurs en fonction du statut de validation.

- [x] Stocker l’horodatage de début de round dans l’objet `room` (ex. `roundStartAt`).
- [x] Calculer le temps de réponse par joueur lors de `checkAnswer` et dériver un score fonction du délai (ex. score maximum décroissant sur 30s, bonus pour combo titre+artiste).
- [x] Conserver l’historique des réponses de chaque round (`room.currentRoundResults`, `room.roundHistory`) pour alimenter les écrans de fin de round/partie.
- [x] Mettre à jour le store côté client pour suivre le score du round et la vitesse de réponse par joueur (`playerStore`, `answerEvaluation`).
- [ ] Exploiter ces données pour des affichages temps réel (barres, badges, etc.).

- [x] Revoir l’input de réponse (`InputAnswer.vue`) afin de guider la saisie (séparation titre/artiste ou suggestions) tout en restant compatible avec l’envoi partiel.
- [ ] Reconcevoir `ModalRoundOver.vue` : afficher la bonne réponse complète, top 3 des joueurs (nom, avatar, score du round, temps de réponse) et animations cohérentes avec la DA.
- [ ] Refonte de `EndingScreen.vue` : présenter le récapitulatif de la partie (statistiques détaillées, classement final enrichi, bouton « Rejouer », bouton « Menu principal »).
- [ ] Vérifier la cohérence visuelle avec les styles globaux (`settings.scss`, thèmes existants) et assurer la responsivité.

### 5. Tests et validation
- [ ] Tester manuellement les scénarios clés : réponses partielles, fautes de frappe, non-réponses, égalités de vitesse.
- [ ] Vérifier l’absence de régressions sur les flux Socket.IO (join, leave, startGame, nextRound).
- [ ] Mettre à jour/ajouter la documentation (README ou AUDIT) si nécessaire concernant les nouvelles règles de score.

### 6. Étapes de livraison
- [ ] S’assurer que les linters/formatters passent côté front et back.
- [ ] Préparer une note de livraison détaillant les changements et les impacts potentiels.

