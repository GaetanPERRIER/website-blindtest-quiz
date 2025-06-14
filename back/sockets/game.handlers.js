const roomService = require('../services/room.service');
const deezerService = require('../services/deezer.service');

module.exports = (io, socket) => {
    socket.on('startGame', async (roomId) => {
        const room = await roomService.startGame(roomId)
        io.to(room.id).emit('roomDataUpdated', room);
    });

    socket.on('songEnded', (roomId, playerId) => {
        const room = roomService.songEnded(roomId, playerId)
        io.to(room.id).emit('roomDataUpdated', room);
    });

    socket.on('nextMusic', (roomId) => {
        const room = roomService.nextMusic(roomId)
        io.to(room.id).emit('roomDataUpdated', room);
    });

    socket.on('checkAnswer', (roomId, playerId, answer) => {
        const room = roomService.checkAnswer(roomId, playerId, answer)
        io.to(room.id).emit('roomDataUpdated', room);
    });

};