const roomService = require('../services/room.service');

module.exports = (io, socket) => {
    socket.on('getRooms', () => {
        socket.emit('roomList', roomService.rooms);
    });


    // Join a room, create a new one if the player as no roomId specified
    socket.on('joinRoom', (player) => {
        try {
            let room;
            player.socketId = socket.id;

            // If user is authenticated, use their data
            if (socket.user) {
                player.userId = socket.user.sub;
                player.username = socket.user.user_metadata?.full_name || socket.user.user_metadata?.name || player.username;
                player.avatarUrl = socket.user.user_metadata?.avatar_url;
            }

            if (!player.roomId) {
                room = roomService.createRoom(player);
                player.host = true;
                
                socket.emit('roomCreated', room);
            } else {
                room = roomService.joinRoom(player);
                player.host = false;
            }

            socket.join(room.id);
            socket.emit('roomJoined', room)
            io.to(room.id).emit('playerListUpdated', room.players);
        } catch (error) {
            socket.emit('error', error.message);
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
        const room = roomService.disconnect(socket.id);
        if (room !== null) {
            socket.leave(roomId);
            io.to(room.id).emit('playerListUpdated', room.players);
        }
    });

    // Eject a player of a room
    socket.on('ejectPlayer', (roomId, playerId) => {
        const room = roomService.ejectPlayer(roomId, playerId)
        if (room !== null) {
            io.to(room.id).emit('playerListUpdated', room.players);
        }
    })

    // Select a Blindtest category
    socket.on('selectCategory', (roomId, newCategory) => {
        const room = roomService.selectCategory(roomId, newCategory)
        if (room) io.to(room.id).emit('categorySelected', room.setting.category);
    })

    // Select a Song Count
    socket.on('selectSongCount', (roomId, newSongCount) => {
        const room = roomService.selectSongCount(roomId, newSongCount)
        if (room) io.to(room.id).emit('songCountSelected', room.setting.songCount);
    })
};