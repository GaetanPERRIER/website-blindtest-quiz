const roomHandlers = require('./room.handlers');
const gameHandlers = require('./game.handlers');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('[Nouvelle connexion] :', socket.id);

        // Enregistrement des handlers
        roomHandlers(io, socket);
        gameHandlers(io, socket);

        socket.on('disconnect', () => {
            console.log('[Nouvelle déconnexion]:', socket.id);
        });
    });
};