const roomHandlers = require('./room.handlers');
const classicHandlers = require('./modes/classic.handlers');

module.exports = (io) => {
    io.on('connection', (socket) => {
        // console.log('[Nouvelle connexion] :', socket.id);

        // Enregistrement des handlers
        roomHandlers(io, socket);
        classicHandlers(io, socket);

        socket.on('disconnect', () => {
            // console.log('[Nouvelle déconnexion]:', socket.id);
        });
    });
};