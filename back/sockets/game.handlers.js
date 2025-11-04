const roomService = require('../services/room.service');
const gameService = require('../services/game.service');

module.exports = (io, socket) => {
    socket.on('startGame', async (roomId) => {
        try {
            roomService.assertHost(roomId, socket.id);
            const room = await gameService.startGame(roomId, roomService);
            io.to(room.id).emit('gameStarted', room);

            // Démarrer le premier round
            await playNextRound(roomId, io, roomService, gameService);
        } catch (error) {
            socket.emit('game:error', error.message);
        }
    });


    socket.on('checkAnswer', (roomId, socketId, answer) => {
        try {
            const room = gameService.checkAnswer(roomId, socketId, answer, roomService)

            if (gameService.AllPlayerGuessed(room)) {
                // Annuler le timeout si tous les joueurs ont deviné
                if (room.currentRoundTimeout) {
                    clearTimeout(room.currentRoundTimeout)
                    room.currentRoundTimeout = null
                }
                
                // Terminer le round immédiatement
                const updatedRoom = gameService.endRound(roomId, roomService)
                io.to(room.id).emit('roundEnded', updatedRoom)
                
                // Afficher le modal de récap pendant 5 secondes puis passer au round suivant
                setTimeout(async () => {
                    try {
                        await playNextRound(roomId, io, roomService, gameService)
                    } catch (error) {
                        io.to(roomId).emit('game:error', error.message)
                    }
                }, 5000)
            }

            const player = room.players.find(player => player.socketId === socketId)
            if (player && player.titleGuessed){
                socket.emit('titleGuessed', room.players)
            }
        } catch (error) {
            socket.emit('game:error', error.message)
        }
    });


    socket.on('playerReady',(roomId, socketId) => {
        try {
            const room = roomService.setPlayerReady(roomId, socketId)
            io.to(room.id).emit('playerListUpdated', room.players)
        } catch (error) {
            socket.emit('game:error', error.message)
        }
    })

    // Fonction récursive pour gérer les rounds
    const playNextRound = async (roomId, io, roomService, gameService) => {
        let room = roomService.getRoom(roomId)
        
        // Vérifier si on a atteint le nombre maximum de rounds
        if (room.round >= room.setting.songCount - 1) {
            // Fin de la partie
            room.state = "ended"
            if (room.currentRoundTimeout) {
                clearTimeout(room.currentRoundTimeout)
                room.currentRoundTimeout = null
            }
            io.to(room.id).emit('gameFinished', room)
            return
        }

        // Lancer un nouveau round
        room = await gameService.nextRound(roomId, roomService)
        io.to(room.id).emit('roomUpdated', room)
        
        // Démarrer le timer de 30 secondes
        const roundTimeout = setTimeout(async () => {
            try {
                // Timeout atteint - terminer le round
                const endedRoom = gameService.endRound(roomId, roomService)
                io.to(room.id).emit('roundEnded', endedRoom)
                
                // Afficher le modal de récap pendant 5 secondes
                setTimeout(async () => {
                    await playNextRound(roomId, io, roomService, gameService)
                }, 5000)
            } catch (error) {
                io.to(roomId).emit('game:error', error.message)
            }
        }, 30000)

        // Stocker le timeout pour pouvoir l'annuler si tous les joueurs devinent
        room.currentRoundTimeout = roundTimeout
    }

};