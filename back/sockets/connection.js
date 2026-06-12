const roomHandlers = require('./room.handlers');
const classicHandlers = require('./modes/classic.handlers');
const jwt = require('jsonwebtoken');

module.exports = (io) => {
    // Middleware Socket.io pour l'authentification
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(); // Invité
        }

        const jwtSecret = process.env.SUPABASE_JWT_SECRET;
        if (!jwtSecret) return next();

        try {
            const decoded = jwt.verify(token, jwtSecret);
            socket.user = decoded;
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
            onlineUsers.set(socket.user.sub, socket.id);
            io.emit('userStatusChanged', { userId: socket.user.sub, status: 'online' });
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
                    fromUserId: socket.user?.sub
                });
            }
        });

        socket.on('disconnect', () => {
            if (socket.user) {
                onlineUsers.delete(socket.user.sub);
                io.emit('userStatusChanged', { userId: socket.user.sub, status: 'offline' });
            }
        });
    });
};