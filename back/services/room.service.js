const { DEFAULT_GAME_SETTINGS } = require('../config/constants');
class RoomService {
    constructor() {
        this.rooms = [];
    }

    createRoom(player) {
        const room = {
            id: this.generateRoomId(),
            players: [player],
            setting: {
                category: null,
                songCount: DEFAULT_GAME_SETTINGS.songCount,
            },
            state: "config",
            playlist: [],
            round: -1,
            currentMusic: {},
            roundSummary: {}
        }

        player.roomId = room.id
        this.rooms.push(room)
        return room;
    }

    getRoom(roomId) {
        const room = this.rooms.find(r => r.id === roomId);

        if (!room) {
            console.warn(`Room ${roomId} not found`);
            return null;
        }

        return room;
    }


    joinRoom(player) {
        const room = this.getRoom(player.roomId)
        if (!room) throw new Error('Room not found');

        if (room.players.length >= DEFAULT_GAME_SETTINGS.maxPlayers) {
            throw new Error('Room is full');
        }

        if (room.state !== 'config') {
            throw new Error('Game already started');
        }

        const existingPlayer = room.players.find(p => p.socketId === player.socketId);
        if (existingPlayer) {
            return room;
        }

        player.host = false
        room.players.push(player)

        return room
    }

    disconnect(socketId) {
        let roomToUpdate = null;

        this.rooms.forEach((room) => {
            const playerIndex = room.players.findIndex((p) => p.socketId === socketId);

            if (playerIndex !== -1) {
                const disconnectedPlayer = room.players[playerIndex];
                room.players.splice(playerIndex, 1); // Supprimer le joueur de la salle

                if (disconnectedPlayer.host && room.players.length > 0) {
                    room.players[0].host = true;
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
        if (!room) return null;

        const playerIndex = room.players.findIndex(p => p.socketId === playerId);
        if (playerIndex === -1) {
            return room // The player is not found in the room
        }

        const playerToEject = room.players[playerIndex]
        const wasHost = playerToEject.host
        room.players.splice(playerIndex, 1);

        if (room.players.length === 0) {
            this.deleteRoom(roomId);
            return null;
        }

        if (wasHost) {
            room.players[0].host = true;
        }

        return room;
    }

    selectCategory(roomId, category) {
        const room = this.getRoom(roomId)
        if (room) room.setting.category = category
        return room
    }

    selectSongCount(roomId, newSongCount) {
        const room = this.getRoom(roomId)
        if (room) {
            const count = Math.min(Math.max(1, parseInt(newSongCount)), DEFAULT_GAME_SETTINGS.maxSongCount);
            room.setting.songCount = count;
        }
        return room
    }

    generateRoomId() {
        return Math.random().toString(36).substring(2, 9);
    }

    setPlayerReady(roomId, socketId) {
        const room = this.getRoom(roomId)
        if (!room) return null;
        const player = room.players.find(p => p.socketId === socketId)
        if (player) player.isReady = true
        return room
    }

    setAllPlayersUnready(roomId) {
        const room = this.getRoom(roomId)
        if (!room) return null;

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
