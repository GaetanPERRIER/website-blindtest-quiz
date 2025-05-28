// server.js
const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}))
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000", // Remplacez par l'origine autorisée
        methods: ["GET", "POST"], // Méthodes HTTP autorisées
    },
});

let rooms = []


io.on('connection', (socket) => {
    console.log('[Nouvelle connexion] :', socket.id);

    // Envoyer la liste des salles au client
    socket.on('get rooms', () => {
        io.to(socket.id).emit('list rooms', rooms);
    })

    // Ajouter un joueur à une salle ou en créer une nouvelle si besoin
    socket.on('playerData', (player) => {
        console.log('[Nom du joueur] :', player.username);
        let room = null;

        if (!player.roomId) {
            // Créer une nouvelle salle
            room = createRoom(player);
            console.log('[Room créée] :' + room.id + ' avec le joueur ' + player.username);

            // Définir le joueur comme hôte
            player.host = true;

            socket.emit('roomCreated', { roomId: room.id });
        } else {
            // Rejoindre une salle existante
            room = rooms.find(r => r.id === player.roomId);

            if (room === undefined) {
                return;
            }

            // Définir le joueur comme non-hôte
            player.host = false;
            room.players.push(player);
        }

        socket.join(room.id);
        io.to(room.id).emit('roomDataUpdated', room);
    });

    socket.on('eject player', (roomId, playerId) => {
        const room = rooms.find(r => r.id === roomId);
        if (!room) {
            return;
        }

        const playerIndex = room.players.findIndex(p => p.socketId === playerId);
        const playerToEject = room.players[playerIndex];

        if (playerIndex !== -1) {
            room.players.splice(playerIndex, 1); // Supprimer le joueur de la salle
            console.log(`[Joueur expulsé] : ${playerToEject.username} de la salle ${room.id}`);
            io.to(room.id).emit('roomDataUpdated', room);
        }
    })


    // Selectionner une catégorie de blindtest
    socket.on('select category', (roomId, category) => {
        const room = rooms.find(r => r.id === roomId);
        if (!room) {
            return;
        }

        room.category = category;
        io.to(room.id).emit('roomDataUpdated', room);
    })

    // Sélectionner le nombre de musiques
    socket.on('select song count', (roomId, songCount) => {
        const room = rooms.find(r => r.id === roomId);
        if (!room) {
            return;
        }

        room.songCount = songCount;
        io.to(room.id).emit('roomDataUpdated', room);
    })

    // Sélectionner la difficulté
    socket.on('select difficulty', (roomId, difficulty) => {
        const room = rooms.find(r => r.id === roomId);
        if (!room) {
            return;
        }

        room.difficulty = difficulty;
        io.to(room.id).emit('roomDataUpdated', room);
    })


    // Lancer le jeu
    socket.on('start game', async (roomId, urlTracklist, nbMusics, difficulty) => {
        const room = rooms.find(r => r.id === roomId);
        if (!room) return;

        try {
            let allTracks = [];
            let nextUrl = urlTracklist;

            while (nextUrl) {
                const response = await fetch(nextUrl);
                if (!response.ok) throw new Error(`Erreur Deezer: ${response.statusText}`);
                const data = await response.json();
                allTracks = allTracks.concat(data.data);
                nextUrl = data.next;
            }

            // Filtrer selon la difficulté
            let filteredTracks;
            switch (difficulty) {
                case 'easy':
                    filteredTracks = allTracks.filter(track => track.rank >= 700000); // populaires
                    break;
                case 'normal':
                    filteredTracks = allTracks.filter(track => track.rank >= 300000 && track.rank < 700000);
                    break;
                case 'hard':
                    filteredTracks = allTracks.filter(track => track.rank < 300000); // peu connues
                    break;
                default:
                    filteredTracks = allTracks; // fallback
            }

            // Si pas assez de morceaux, compléter avec des aléatoires
            if (filteredTracks.length < nbMusics) {
                filteredTracks = filteredTracks.concat(
                    allTracks.filter(t => !filteredTracks.includes(t)).slice(0, nbMusics - filteredTracks.length)
                );
            }

            // Mélanger et tronquer
            filteredTracks = filteredTracks.sort(() => Math.random() - 0.5).slice(0, nbMusics);

            room.musicsToGuess = filteredTracks;
            room.currentMusic = 0;
            room.gameStarted = true;

            // Réinitialiser les réponses des joueurs
            room.players.forEach(player => {
                player.titleGuessed = false;
                player.artistGuessed = false;
                player.score = 0;
            })

            io.to(room.id).emit('roomDataUpdated', room);
        } catch (error) {
            console.error('Erreur API Deezer:', error);
            io.to(socket.id).emit('error', 'Erreur API Deezer');
        }
    });


    // Vérifier la réponse du joueur
    socket.on('check answer', (roomId, playerId, answer) => {

        const room = rooms.find(r => r.id === roomId);
        if (!room || !room.gameStarted) return;

        const currentMusic = room.musicsToGuess[room.currentMusic];
        const isCorrect = answer.toLowerCase() === currentMusic.title.toLowerCase();

        const player = room.players.find(p => p.socketId === playerId);
        if (!player) return;

        if (isCorrect) {
            player.titleGuessed = true;
            player.score += 10;
            console.log(`[Bonne réponse] : ${player.username} a trouvé le titre ${currentMusic.title}`);

            // Vérifier si tous les joueurs ont trouvé le titre
            const allPlayersGuessed = room.players.every(p => p.titleGuessed);
            if (allPlayersGuessed) {
                room.roundEnded = true;
                console.log('[Fin de la ronde] : Tous les joueurs ont trouvé le titre');
            }
            io.to(room.id).emit('roomDataUpdated', room);
        }
    })

    // Fin du song
    socket.on('song ended', (roomId, playerId) => {

        const room = rooms.find(r => r.id === roomId);
        if (!room || !room.gameStarted) return;

        // Vérifier si le joueur a déjà deviné le titre
        const player = room.players.find(p => p.socketId === playerId);
        if (!player || player.titleGuessed) return;

        // Si le joueur n'a pas deviné le titre, marquer comme non deviné
        player.titleGuessed = true;
        console.log(`[Fin de la chanson] : ${player.username} n'a pas trouvé le titre`);

        // Vérifier si tous les joueurs ont trouvé le titre
        const allPlayersGuessed = room.players.every(p => p.titleGuessed);
        if (allPlayersGuessed) {
            room.roundEnded = true;
            console.log('[Fin de la ronde] : Tous les joueurs ont trouvé le titre ou la chanson est terminée sans réponse');
        }

        io.to(room.id).emit('roomDataUpdated', room);
    })


    // Passer à la musique suivante
    socket.on('next music', (roomId) => {
        const room = rooms.find(r => r.id === roomId);
        if (!room || !room.gameStarted) return;

        // Réinitialiser les réponses des joueurs
        room.players.forEach(player => {
            player.titleGuessed = false;
            player.artistGuessed = false;
        });

        // Passer à la musique suivante
        room.currentMusic++;
        room.roundEnded = false;

        if (room.currentMusic >= room.musicsToGuess.length) {
            console.log('[Fin du jeu] : Toutes les musiques ont été jouées');
            room.gameStarted = false; // Fin du jeu
        }
        io.to(room.id).emit('roomDataUpdated', room);
    })


    // Déconnexion du joueur
    socket.on('disconnect', () => {
        console.log('[Déconnexion] :', socket.id);

        let roomToUpdate = null;

        // Parcourir les salles pour trouver et supprimer le joueur déconnecté
        rooms.forEach((room) => {
            const playerIndex = room.players.findIndex((p) => p.socketId === socket.id);

            if (playerIndex !== -1) {
                const disconnectedPlayer = room.players[playerIndex];
                room.players.splice(playerIndex, 1); // Supprimer le joueur de la salle

                if (disconnectedPlayer.host && room.players.length > 0) {
                    room.players[0].host = true; // Le premier joueur devient l'hôte
                    console.log(`[Nouveau hôte] : ${room.players[0].username}`);
                }

                roomToUpdate = room;
            }
        });

        // Supprimer les salles vides
        rooms = rooms.filter((room) => room.players.length > 0);

        // Si la salle existe encore, émettre la mise à jour des joueurs
        if (roomToUpdate) {
            io.to(roomToUpdate.id).emit('roomDataUpdated', roomToUpdate);
        }

        console.log('[Salles restantes] :', rooms);
    });
})


function createRoom(player){
    const room = {
        id : generateRoomId(),
        players: [],
        category: null,
        songCount: 10,
        difficulty: "easy",
        musicsToGuess: [],
        currentMusic : 0,
        gameStarted : false,
        roundEnded  : false,
    }

    player.roomId = room.id;
    room.players.push(player);
    rooms.push(room);

    return room;
}

function generateRoomId() {
    return Math.random().toString(36).substring(2, 9);
}















app.get('/api/deezer/get-categories', async (req, res) => {
    const deezerUrl = 'https://api.deezer.com/chart'; // URL de l'API Deezer passée en paramètre

    if (!deezerUrl) {
        return res.status(400).json({ error: 'La requête doit inclure un paramètre "q" avec l\'URL de l\'API Deezer.' });
    }

    try {
        const response = await fetch(deezerUrl);
        if (!response.ok) {
            throw new Error(`Erreur lors de l'appel à Deezer: ${response.statusText}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API Deezer:', error);
        res.status(500).json({ error: 'Erreur lors de l\'appel à l\'API Deezer' });
    }
});


app.post('/api/deezer/start-blindtest', async (req, res) => {
    const trackListUrl = req.body.trackListUrl; // URL de la liste de pistes à jouer

    if (!trackListUrl) {
        return res.status(400).json({ error: 'La requête doit inclure un paramètre "trackListUrl" avec l\'URL de la liste de pistes.' });
    }

    try {
        const response = await fetch(trackListUrl);
        if (!response.ok) {
            throw new Error(`Erreur lors de l'appel à Deezer: ${response.statusText}`);
        }
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Erreur lors de l\'appel à l\'API Deezer:', error);
        res.status(500).json({ error: 'Erreur lors de l\'appel à l\'API Deezer' });
    }
});

httpServer.listen(3001);