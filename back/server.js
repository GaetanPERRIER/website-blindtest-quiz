const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
// lire les variables d'environnement'
require('dotenv').config();


const { PORT, CLIENT_URL } = require('./config/constants');
const { corsOptions } = require('./config/cors');
const musicRoutes = require('./routes/music.routes');
const authRoutes = require('./routes/auth.routes');
const friendRoutes = require('./routes/friend.routes');
const profileRoutes = require('./routes/profile.routes');
const setupSocketIO = require('./sockets/connection');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: CLIENT_URL,
        methods: ["GET", "POST"]
    }
});

setupSocketIO(io);

app.use(cors(corsOptions));
app.use(express.json());

// REST routes
app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/profile', profileRoutes);

// Middleware d'erreur global : sans lui, une erreur (CORS refuse, body
// trop volumineux, JSON malforme...) remonte sous forme de page HTML ou
// de coupure de connexion brute plutot qu'une reponse JSON exploitable
// par le front.
app.use((err, req, res, next) => {
    console.error(err);
    const status = err.status || (err.type === 'entity.too.large' ? 413 : 500);
    res.status(status).json({ error: err.message || 'Erreur serveur.' });
});

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { app, httpServer };