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



httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { app, httpServer };