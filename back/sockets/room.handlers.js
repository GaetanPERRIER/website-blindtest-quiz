const roomService = require('../services/room.service');

module.exports = (io, socket) => {
    socket.on('getRooms', () => {
        const rooms = roomService.rooms.map((room) => ({
            id: room.id,
            playerCount: room.players.length,
            gameStarted: room.gameStarted
        }));
        socket.emit('roomList', rooms);
    });


    // Join a room, create a new one if the player as no roomId specified
    socket.on('joinRoom', ({ username, roomId }) => {
        try {
            let room;

            if (!roomId) {
                room = roomService.createRoom({
                    socketId: socket.id,
                    username
                });
                socket.emit('roomCreated', room);
            } else {
                room = roomService.joinRoom(roomId, {
                    socketId: socket.id,
                    username
                });
            }

            socket.join(room.id);
            socket.emit('roomJoined', room);
            io.to(room.id).emit('playerListUpdated', room.players);
        } catch (error) {
            socket.emit('room:error', error.message);
        }
    });

    // Handle player socket disconection
    socket.on('disconnect', () => {
        const room = roomService.disconnect(socket.id)

        if (room !== null) {
            io.to(room.id).emit('playerListUpdated', room.players);
        }
    })

    // Handle when a player manually leaves the room
    socket.on('leaveRoom', (roomId) => {
        try {
            const room = roomService.disconnect(socket.id);
            if (room !== null) {
                socket.leave(roomId);
                io.to(room.id).emit('playerListUpdated', room.players);
            }
        } catch (error) {
            socket.emit('room:error', error.message);
        }
    });

    // Eject a player of a room
    socket.on('ejectPlayer', (roomId, playerId) => {
        try {
            const room = roomService.assertHost(roomId, socket.id);
            if (playerId === socket.id) {
                throw new Error('Impossible de s’auto-exclure en tant qu’hôte');
            }
            const updatedRoom = roomService.ejectPlayer(room.id, playerId);
            if (updatedRoom) {
                io.to(room.id).emit('playerListUpdated', updatedRoom.players);
            }
        } catch (error) {
            socket.emit('room:error', error.message);
        }
    })

    // Select a Blindtest category
    socket.on('selectCategory', (roomId, newCategory) => {
        try {
            roomService.assertHost(roomId, socket.id);
            const room = roomService.selectCategory(roomId, newCategory)
            io.to(room.id).emit('categorySelected', room.setting.category);
        } catch (error) {
            socket.emit('room:error', error.message);
        }
    })

    // Select a Song Count
    socket.on('selectSongCount', (roomId, newSongCount) => {
        try {
            roomService.assertHost(roomId, socket.id);
            const room = roomService.selectSongCount(roomId, newSongCount)
            io.to(room.id).emit('songCountSelected', room.setting.songCount);
        } catch (error) {
            socket.emit('room:error', error.message);
        }
    })

    // Select a difficulty
    socket.on('selectDifficulty', (roomId, newDifficulty) => {
        try {
            roomService.assertHost(roomId, socket.id);
            const room = roomService.selectDifficulty(roomId, newDifficulty)
            io.to(room.id).emit('difficultySelected', room.setting.difficulty);
        } catch (error) {
            socket.emit('room:error', error.message);
        }
    })
};