const roomService = require('../services/room.service');
const deezerService = require('../services/deezer.service');

module.exports = (io, socket) => {
    socket.on('startGame', async (roomId) => {
        let room = await roomService.startGame(roomId)

        for (let i = 0 ; i < room.setting.songCount ; i++) {

            // Lancer un nouveau round
            room = await roomService.nextRound(roomId)
            io.to(room.id).emit('roomUpdated', room)

            setTimeout(() => {
                console.log("Logs Apres 5 secs")
            }, 30000)


            // Tant que tous les joueurs n'ons pas deviné : ne rien faire, sinon on sort du while ce qui bloquera la manche en attendant les 30 sec de délai
        }





        const playRound = async () => {
            if (room.round >= room.setting.songCount) {
                io.to(room.id).emit('gameFinished', room)
                return
            }

            // Lancer un nouveau round
            room = await roomService.nextRound(roomId)
            io.to(room.id).emit('roomUpdated', room)
        }

        playRound()
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