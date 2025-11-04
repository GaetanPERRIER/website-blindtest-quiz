const crypto = require('crypto');
const { DEFAULT_GAME_SETTINGS, GAME_RULES, ROOM } = require('../config/constants');
const {
    sanitizeUsername,
    assertAllowedDeezerUrl,
    assertValidDifficulty,
    assertValidSongCount
} = require('../utils/validation');

class RoomService {
    constructor() {
        this.rooms = [];
    }

    // Créer une room
    createRoom({ socketId, username }) {
        const sanitizedUsername = sanitizeUsername(username);

        const player = {
            socketId,
            username: sanitizedUsername,
            host: true,
            isReady: false,
            score: 0,
            totalScore: 0,
            titleGuessed: false,
            artistGuessed: false,
            currentRoundScore: 0,
            firstCorrectAt: null,
            completedAt: null,
            roundHistory: []
        };

        const room = {
            id: this.generateRoomId(),
            players: [player],

            setting: {
                category: null,
                songCount: DEFAULT_GAME_SETTINGS.songCount,
                difficulty: DEFAULT_GAME_SETTINGS.difficulty,
            },

            state: "config", // config, guessing, answer, ended
            playlist : [], // ancienement MusicsToGuess
            round : -1,
            currentMusic : {},
            roundSummary : null,
            currentRoundResults: [],
            roundHistory: [],
            gameStarted: false
        };

        player.roomId = room.id;

        this.rooms.push(room);
        return room;
    }

    // Trouver une room en fonction de son ID dans le tableau des rooms
    getRoom(roomId) {
        const room = this.rooms.find(r => r.id === roomId);

        if (!room) {
            throw new Error('Room not found');
        }

        return room;
    }


    // Rejoindre une room
    joinRoom(roomId, { socketId, username }) {
        const room = this.getRoom(roomId);

        if(room.players.length >= DEFAULT_GAME_SETTINGS.maxPlayers) {
            throw new Error('Salle complète');
        }

        if(room.gameStarted) {
            throw new Error('Partie déjà commencée');
        }

        const existingPlayer = room.players.find(p => p.socketId === socketId);
        if (existingPlayer) {
            return room;
        }

        const sanitizedUsername = sanitizeUsername(username);

        const player = {
            socketId,
            username: sanitizedUsername,
            host: false,
            isReady: false,
            score: 0,
            totalScore: 0,
            titleGuessed: false,
            artistGuessed: false,
            currentRoundScore: 0,
            firstCorrectAt: null,
            completedAt: null,
            roundHistory: []
        };

        player.roomId = room.id;

        room.players.push(player);

        return room
    }

    // Quand un socket se déconnecte (ferme la page) et qu'il était dans une salle, le faire quitter et passer le role host
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

    // Faire quitter un joueur d'une salle
    ejectPlayer(roomId, playerId) {
        const room = this.getRoom(roomId)

        const playerIndex = room.players.findIndex(p => p.socketId === playerId);
        if (playerIndex === -1) {
            return room // The player is not found in the room
        }

        const playerToEject = room.players[playerIndex]
        const wasHost = playerToEject.host
        room.players.splice(playerIndex, 1);

        console.log(`[Un joueur a quitter la room] : ${playerToEject.username} de la salle ${room.id}`);
        
        // S'il n'y a plus de joueur dans la salle : la supprimer
        if (room.players.length === 0) {
            this.deleteRoom(roomId);
            console.log(`[Salle supprimée] : ${roomId} (vide)`);
            return null;
        }

        // Si l'host à quitter, donner le role à un autre joueur
        if (wasHost) {
            room.players[0].host = true;
            console.log(`[Nouvel hôte] : ${room.players[0].username} dans la salle ${room.id}`);
        }

        return room;
    }

    // === Configuration de la room ===

    selectCategory(roomId, category) {
        const room = this.getRoom(roomId)

        if (!category || typeof category !== 'object') {
            throw new Error('Catégorie invalide');
        }

        if (!category.tracklist) {
            throw new Error('Catégorie sans playlist');
        }

        const safeTracklist = assertAllowedDeezerUrl(category.tracklist, 'trackListUrl');

        room.setting.category = {
            id: category.id,
            title: category.title,
            picture: category.picture,
            picture_big: category.picture_big,
            tracklist: safeTracklist
        };
        return room
    }

    selectSongCount(roomId, newSongCount) {
        const room = this.getRoom(roomId)

        const validCount = assertValidSongCount(newSongCount);
        room.setting.songCount = validCount
        return room
    }

    selectDifficulty(roomId, difficulty) {
        const room = this.getRoom(roomId)

        const validDifficulty = assertValidDifficulty(difficulty);
        room.setting.difficulty = validDifficulty
        return room
    }

    generateRoomId() {
        if (crypto.randomUUID) {
            return crypto.randomUUID().replace(/-/g, '').substring(0, ROOM.ID_LENGTH);
        }

        return crypto.randomBytes(ROOM.ID_LENGTH).toString('base64url').substring(0, ROOM.ID_LENGTH);
    }

    setPlayerReady(roomId, socketId) {
        const room = this.getRoom(roomId)

        const player = room.players.find(p => p.socketId === socketId)
        if (!player) {
            throw new Error('Joueur introuvable dans la salle');
        }
        player.isReady = true

        return room
    }

    setAllPlayersUnready(roomId) {
        const room = this.getRoom(roomId)

        room.players.forEach(player => {
            player.isReady = false
        })

        return room
    }

    deleteRoom(roomId) {
        this.rooms = this.rooms.filter(room => room.id !== roomId);
    }

    isHost(roomId, socketId) {
        const room = this.getRoom(roomId);
        return room.players.some((player) => player.socketId === socketId && player.host);
    }

    assertHost(roomId, socketId) {
        const room = this.getRoom(roomId);
        if (!this.isHost(roomId, socketId)) {
            throw new Error('Action réservée à l’hôte');
        }
        return room;
    }
}

module.exports = new RoomService();
