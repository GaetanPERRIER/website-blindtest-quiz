const roomService = require('../../services/room.service');
const gameService = require('../../services/game.service');

module.exports = (io, socket) => {
    socket.on('startGame', async (roomId) => {
        try {
            const room = await gameService.startGame(roomId, roomService)
            if (room) {
                await playNextRound(roomId, io, roomService, gameService)
            }
        } catch (error) {
            socket.emit('error', error.message);
        }
    });


    socket.on('checkAnswer', (roomId, socketId, answer) => {
        const room = gameService.checkAnswer(roomId, socketId, answer, roomService)
        if (!room) return;

        if (gameService.AllPlayerGuessed(room)) {
            // Cancel timeout if all players guessed
            if (room.currentRoundTimeout) {
                clearTimeout(room.currentRoundTimeout)
                room.currentRoundTimeout = null
            }
            
            const updatedRoom = gameService.endRound(roomId, roomService)
            io.to(room.id).emit('roundEnded', updatedRoom)
            
            // Show round recap for 5s then move to next round
            setTimeout(async () => {
                await playNextRound(roomId, io, roomService, gameService)
            }, 5000)
        }

        const player = room.players.find(player => player.socketId === socketId)
        if (player && player.titleGuessed){
            socket.emit('titleGuessed', room.players)
        }
    });


    socket.on('playerReady', (roomId, socketId) => {
        const room = roomService.setPlayerReady(roomId, socketId)
        if (room) {
            io.to(room.id).emit('playerListUpdated', room.players)
        }
    })

    const playNextRound = async (roomId, io, roomService, gameService) => {
        let room = roomService.getRoom(roomId)
        if (!room) return;
        
        if (room.round >= room.setting.songCount - 1) {
            room.state = "ended"
            io.to(room.id).emit('gameFinished', room)
            return
        }

        room = await gameService.nextRound(roomId, roomService)
        io.to(room.id).emit('roomUpdated', room)
        
        const roundTimeout = setTimeout(async () => {
            room = gameService.endRound(roomId, roomService)
            if (room) {
                io.to(room.id).emit('roundEnded', room)
                
                // Show round recap for 5s then move to next round
                setTimeout(async () => {
                    await playNextRound(roomId, io, roomService, gameService)
                }, 5000)
            }
        }, 30000)

        room.currentRoundTimeout = roundTimeout
    }

};
