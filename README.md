# 🎵 Website Blindtest Quiz

Un jeu de blindtest multijoueur en temps réel utilisant l'API Deezer pour proposer des quiz musicaux interactifs.

## 🎯 Présentation

Ce projet est une application web de blindtest permettant à plusieurs joueurs de deviner des titres et artistes de musiques en temps réel. L'application utilise l'API Deezer pour récupérer les musiques et propose différentes catégories musicales.

## ✨ Fonctionnalités principales

- **Multijoueur en temps réel** : Jusqu'à 6 joueurs par partie via WebSockets
- **Intégration Deezer** : Accès à un large catalogue musical via l'API Deezer
- **Catégories variées** : Différents genres musicaux disponibles
- **Système de scoring** : Points attribués selon la rapidité de réponse
- **Interface moderne** : Design responsive avec animations fluides
- **Salles privées** : Création de parties avec code d'accès

## 🏗️ Architecture

Le projet suit une architecture client-serveur :

- **Frontend** : Application Vue.js 3 avec Vite
- **Backend** : Serveur Node.js/Express avec Socket.IO
- **API externe** : Intégration avec l'API Deezer

## 🚀 Démarrage rapide

### Prérequis
- Node.js (v16+)
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone [url-du-repo]
cd website-blindtest-quiz

# Installer les dépendances backend
cd back
npm install

# Installer les dépendances frontend
cd ../front
npm install
```

### Lancement
```bash
# Terminal 1 - Backend
cd back
node server.js

# Terminal 2 - Frontend
cd front
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 📁 Structure du projet

```
website-blindtest-quiz/
├── back/           # Serveur Node.js
├── front/          # Application Vue.js
├── README.md       # Ce fichier
└── docs/           # Documentation détaillée
```

## 🎮 Comment jouer

1. **Créer une partie** : Sélectionnez une catégorie musicale et configurez les paramètres
2. **Inviter des joueurs** : Partagez le code de la salle
3. **Lancer le blindtest** : Écoutez les extraits et devinez titre/artiste
4. **Scorer des points** : Plus vous répondez vite, plus vous gagnez de points !

## 📚 Documentation

Pour plus de détails, consultez la documentation complète :

- [🏗️ Architecture](ARCHITECTURE.md) - Structure technique détaillée
- [⚙️ Installation](INSTALLATION.md) - Guide d'installation complet
- [🔌 API](API.md) - Documentation des endpoints et WebSockets
- [🎯 Flux de jeu](GAME_FLOW.md) - Déroulement d'une partie
- [🎨 Frontend](FRONTEND.md) - Architecture Vue.js et composants

## 🛠️ Technologies utilisées

### Backend
- Node.js & Express
- Socket.IO (WebSockets)
- API Deezer

### Frontend
- Vue.js 3 (Composition API)
- Vite
- Pinia (state management)
- SCSS
- Socket.IO Client

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
- Signaler des bugs
- Proposer de nouvelles fonctionnalités
- Améliorer la documentation

## 📄 Licence

Ce projet est sous licence [à définir].

---

*Développé avec ❤️ pour les amateurs de musique*
