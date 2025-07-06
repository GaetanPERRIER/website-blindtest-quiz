const { DEFAULT_GAME_SETTINGS } = require('../config/constants');
const deezerController = require('../controllers/deezer.controller')
const DeezerService = require("./deezer.service");

class RoomService {
    constructor() {
        this.rooms = [];
    }

    createRoom (player) {
        const room = {
            id: this.generateRoomId(),
            players: [player],
            setting: {
                category: null,
                songCount: DEFAULT_GAME_SETTINGS.songCount,
                difficulty: DEFAULT_GAME_SETTINGS.difficulty,
            },
            musicsToGuess: [],
            gameStarted : false,
            round : {
                currentMusic : 0,
                roundEnded  : false,
                bestPlayers : []
            }
        }

        player.roomId = room.id
        this.rooms.push(room)

        return room;
    }

    getRoom(roomId) {
        const room = this.rooms.find(r => r.id === roomId);

        if (!room) {
            throw new Error('Room not found');
        }

        return room;
    }

    joinRoom(player) {
        const room = this.getRoom(player.roomId)
        if(room === undefined) {
            throw new Error('Salle introuvable');
        }

        if(room.players.length >= DEFAULT_GAME_SETTINGS.maxPlayers) {
            throw new Error('Salle complète');
        }

        if(room.gameStarted) {
            throw new Error('Partie déja commencé');
        }

        const existingPlayer = room.players.find(p => p.socketId === player.socketId);
        if (existingPlayer) {
            return room;
        }

        player.host = false
        room.players.push(player)

        return room
    }

    disconnect(socketId){
        let roomToUpdate = null;

        this.rooms.forEach((room) => {
            const playerIndex = room.players.findIndex((p) => p.socketId === socketId);

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

        this.rooms = this.rooms.filter((room) => room.players.length > 0);

        if (roomToUpdate) return roomToUpdate

        return null
    }

    ejectPlayer(roomId, playerId) {
        const room = this.getRoom(roomId)
        if(room === undefined) {
            throw new Error('Salle introuvable');
        }

        const playerIndex = room.players.findIndex(p => p.socketId === playerId);
        if (playerIndex !== -1) {
            const playerToEject = room.players[playerIndex];
            room.players.splice(playerIndex, 1);
            console.log(`[Joueur expulsé] : ${playerToEject.username} de la salle ${room.id}`);
        }

        return room;
    }

    // === Configuration de la room ===

    selectCategory(roomId, category) {
        const room = this.getRoom(roomId)
        if(room === undefined) {
            throw new Error('Salle introuvable');
        }

        room.setting.category = category
        return room
    }

    selectSongCount(roomId, newSongCount) {
        const room = this.getRoom(roomId)
        if(room === undefined) {
            throw new Error('Salle introuvable');
        }

        room.setting.songCount = newSongCount
        return room
    }

    selectDifficulty(roomId, difficulty) {
        const room = this.getRoom(roomId)
        if(room === undefined) {
            throw new Error('Salle introuvable');
        }

        room.setting.difficulty = difficulty
        return room
    }

    generateRoomId() {
        return Math.random().toString(36).substring(2, 9);
    }

    // === Lancement du jeu ===

    async startGame(roomId){
        const room = this.getRoom(roomId)
        if(room === undefined) {
            throw new Error('Salle introuvable');
        }

        const urlTracklist = room.setting.category.tracklist
        const nbMusics = room.setting.songCount
        const difficulty = room.setting.difficulty

        const allTracks = await this.fetchTracks(urlTracklist, nbMusics, difficulty)
        room.players.forEach(player => {
            player.titleGuessed = false;
            player.totalScore = 0;
        })

        room.musicsToGuess = allTracks
        room.gameStarted = true
        return room;
    }

    async fetchTracks(urlTracklist, count, difficulty) {
        let allTracks = []
        try {
            let nextUrl = urlTracklist

            while (nextUrl) {
                const response = await fetch(nextUrl)
                if (!response.ok) throw new Error(`Erreur Deezer: ${response.statusText}`);
                const data = await response.json();
                allTracks = allTracks.concat(data.data);
                nextUrl = data.next;
            }
        } catch (error) {
            console.error('Erreur API Deezer:', error);
        }
        return this.chooseTracks(allTracks, count, difficulty)
    }

    chooseTracks(allTracks, songCount, difficulty) {
        console.log(songCount, difficulty)
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
        if (filteredTracks.length < songCount) {
            filteredTracks = filteredTracks.concat(
                allTracks.filter(t => !filteredTracks.includes(t)).slice(0, songCount - filteredTracks.length)
            );
        }

        filteredTracks = filteredTracks.sort(() => Math.random() - 0.5).slice(0, songCount);
        return filteredTracks
    }

    songEnded(roomId, playerId) {
        const room = this.getRoom(roomId)
        if(room === undefined) {
            throw new Error('Salle introuvable');
        }

        const player = room.players.find(p => p.socketId === playerId);
        if (!player || player.titleGuessed) return room;

        player.titleGuessed = true;
        console.log(`[Fin de la chanson] : ${player.username} n'a pas trouvé le titre`);

        return room
    }

    nextMusic(roomId, playerId) {
        const room = this.getRoom(roomId)
        if(room === undefined) throw new Error('Salle introuvable');

        const player = room.players.find(p => p.socketId === playerId);
        if (!player) throw new Error('Joueur introuvable');

        console.log(player)
        if (player.host) {
            room.players.forEach(player => {
                player.titleGuessed = false;
            });

            // Passer à la musique suivante
            room.round.currentMusic++;
            room.round.roundEnded = false;

            if (room.currentMusic >= room.musicsToGuess.length) {
                console.log('[Fin du jeu] : Toutes les musiques ont été jouées');
                room.gameStarted = false; // Fin du jeu
            }
        }

        return room
    }

    checkAnswer(roomId, playerId, answer) {
        const room = this.getRoom(roomId)
        if(room === undefined) {
            throw new Error('Salle introuvable');
        }

        const currentMusic = room.musicsToGuess[room.round.currentMusic];

        // Faire une méthode pour accepter l'errreur
        const isCorrect = answer.toLowerCase() === currentMusic.title.toLowerCase();
        const player = room.players.find(p => p.socketId === playerId);

        if (isCorrect) {
            player.titleGuessed = true;
            player.score += 100;
            console.log(`[Bonne réponse] : ${player.username} a trouvé le titre ${currentMusic.title}`);
        }
        return room
    }

    AllPlayerGuessed(room) {
        const allPlayersGuessed = room.players.every(p => p.titleGuessed);
        return !!allPlayersGuessed;
    }
}

module.exports = new RoomService();
