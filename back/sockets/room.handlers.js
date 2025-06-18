const roomService = require('../services/room.service');

module.exports = (io, socket) => {
    socket.on('get rooms', () => {
        socket.emit('list rooms', roomService.rooms);
    });

    socket.on('joinRoom', (player) => {
        try {
            let room;
            player.socketId = socket.id;

            if (!player.roomId) {
                room = roomService.createRoom(player);
                player.host = true;
                socket.emit('roomCreated', { roomId: room.id });
            } else {
                room = roomService.joinRoom(player);
                player.host = false;
            }

            socket.join(room.id);
            io.to(room.id).emit('roomDataUpdated', room);
        } catch (error) {
            socket.emit('error', error.message);
        }
    });

    socket.on('disconnect', () => {
        const room = roomService.disconnect(socket.id)

        if (room !== null) {
            io.to(room.id).emit('roomDataUpdated', room);
        }

    })

    socket.on('ejectPlayer', (roomId, playerId) => {
        const room = roomService.ejectPlayer(roomId,playerId)
        io.to(room.id).emit('roomDataUpdated', room);
    })

    socket.on('selectCategory', (roomId, newCategory) => {
        const room = roomService.selectCategory(roomId, newCategory)
        io.to(room.id).emit('roomDataUpdated', room);
    })

    socket.on('selectSongCount', (roomId, newSongCount) => {
        const room = roomService.selectSongCount(roomId, newSongCount)
        io.to(room.id).emit('roomDataUpdated', room);
    })

    socket.on('selectDifficulty', (roomId, newDifficulty) => {
        const room = roomService.selectDifficulty(roomId, newDifficulty)
        io.to(room.id).emit('roomDataUpdated', room);
    })


};