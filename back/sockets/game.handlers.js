const roomService = require('../services/room.service');
const gameService = require('../services/game.service');

module.exports = (io, socket) => {
    socket.on('startGame', async (roomId) => {
        let room = await gameService.startGame(roomId, roomService)
        
        // Démarrer le premier round
        await playNextRound(roomId, io, roomService, gameService)
    });


    socket.on('checkAnswer', (roomId, socketId, answer) => {
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
            console.log("[Round terminé - tous les joueurs ont deviné]")
            
            // Afficher le modal de récap pendant 5 secondes puis passer au round suivant
            setTimeout(async () => {
                await playNextRound(roomId, io, roomService, gameService)
            }, 5000)
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

    // Fonction récursive pour gérer les rounds
    const playNextRound = async (roomId, io, roomService, gameService) => {
        let room = roomService.getRoom(roomId)
        
        // Vérifier si on a atteint le nombre maximum de rounds
        if (room.round >= room.setting.songCount - 1) {
            // Fin de la partie
            room.state = "ended"
            io.to(room.id).emit('gameFinished', room)
            return
        }

        // Lancer un nouveau round
        room = await gameService.nextRound(roomId, roomService)
        io.to(room.id).emit('roomUpdated', room)
        
        // Démarrer le timer de 30 secondes
        const roundTimeout = setTimeout(async () => {
            // Timeout atteint - terminer le round
            room = gameService.endRound(roomId, roomService)
            io.to(room.id).emit('roundEnded', room)
            console.log("[Round terminé - timeout de 30 secondes]")
            
            // Afficher le modal de récap pendant 5 secondes
            setTimeout(async () => {
                // Passer au round suivant
                await playNextRound(roomId, io, roomService, gameService)
            }, 5000)
        }, 30000)

        // Stocker le timeout pour pouvoir l'annuler si tous les joueurs devinent
        room.currentRoundTimeout = roundTimeout
    }

};