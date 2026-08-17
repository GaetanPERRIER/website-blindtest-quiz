const roomHandlers = require('./room.handlers');
const classicHandlers = require('./modes/classic.handlers');
const supabase = require('../config/db');

module.exports = (io) => {
    // Middleware Socket.io pour l'authentification
    io.use(async (socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(); // Invité
        }

        if (!supabase) return next();

        try {
            const { data: { user }, error } = await supabase.auth.getUser(token);
            if (error || !user) {
                console.error('Socket Auth Error:', error?.message || 'Invalid token');
                return next(); // token invalide → connexion en invité, pas de blocage
            }
            socket.user = user;
            next();
        } catch (err) {
            console.error('Socket Auth Error:', err.message);
            next();
        }
    });

    const onlineUsers = new Map(); // userId -> socketId

    io.on('connection', (socket) => {
        // Track online users if authenticated
        if (socket.user) {
            onlineUsers.set(socket.user.id, socket.id);
            io.emit('userStatusChanged', { userId: socket.user.id, status: 'online' });
        }

        // Enregistrement des handlers
        roomHandlers(io, socket);
        classicHandlers(io, socket);

        // Social Handlers
        socket.on('sendInvitation', ({ toUserId, roomId, fromName }) => {
            const targetSocketId = onlineUsers.get(toUserId);
            if (targetSocketId) {
                io.to(targetSocketId).emit('receiveInvitation', {
                    roomId,
                    fromName,
                    fromUserId: socket.user?.id
                });
            }
        });

        socket.on('disconnect', () => {
            if (socket.user) {
                onlineUsers.delete(socket.user.id);
                io.emit('userStatusChanged', { userId: socket.user.id, status: 'offline' });
            }
        });
    });
};