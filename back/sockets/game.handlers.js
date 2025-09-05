const roomService = require('../services/room.service');
const deezerService = require('../services/deezer.service');

module.exports = (io, socket) => {
    socket.on('startGame', async (roomId) => {
        const room = await roomService.startGame(roomId)
        io.to(room.id).emit('gameStarted', room);
        io.to(room.id).emit('roundStarted', room)
    });

    // game.handler.js
    socket.on('songEnded', (roomId, socketId) => {
        const room = roomService.songEnded(roomId, socketId)

        if(roomService.AllPlayerGuessed(room)) {
            room.round.roundEnded = true
        }

        if (room.round.roundEnded){
            io.to(room.id).emit('roundEnded', room)
            console.log("[Round terminé]")
        }
    });

    socket.on('nextMusic', (roomId, socketId) => {
        let room = roomService.nextMusic(roomId, socketId)

        if(room.gameEnded) {
            room = roomService.setAllPlayersUnready(roomId)
            io.to(room.id).emit('gameEnded', room)
            console.log("[Partie terminée]")
        }
        else {
            io.to(room.id).emit('roundStarted', room)
            console.log("[Nouveau round commencé]")
        }
    });

    socket.on('checkAnswer', (roomId, socketId, answer) => {
        const room = roomService.checkAnswer(roomId, socketId, answer)

        if (roomService.AllPlayerGuessed(room)) {
            room.round.roundEnded = true
            io.to(room.id).emit('roundEnded', room)
            console.log("[Round terminé]")
        }

        const player = room.players.find(player => player.socketId === socketId)
        if (player.titleGuessed){
            socket.emit('titleGuessed', room.players)
        }
    });


    socket.on('playerReady',(roomId, socketId) => {
        const room = roomService.setPlayerReady(roomId, socketId)
        console.log("[Player ready]")
        io.to(room.id).emit('playerListUpdated', room.players)
    })

};