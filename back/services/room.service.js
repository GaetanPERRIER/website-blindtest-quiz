const { DEFAULT_GAME_SETTINGS } = require('../config/constants');
const deezerController = require('../controllers/deezer.controller')
const DeezerService = require("./deezer.service");

class RoomService {
    constructor() {
        this.rooms = [];
    }

    // Créer une room
    createRoom (player) {
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
            roundSummary : {}
        }

        player.roomId = room.id
        this.rooms.push(room)

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

    setPlayerReady(roomId, socketId) {
        const room = this.getRoom(roomId)

        const player = room.players.find(p => p.socketId === socketId)
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
}

module.exports = new RoomService();
