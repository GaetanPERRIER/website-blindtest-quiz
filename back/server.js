const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const { PORT, CLIENT_URL } = require('./config/constants');
const { corsOptions } = require('./config/cors');
const musicRoutes = require('./routes/music.routes');
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
app.use('/api/music', musicRoutes);

httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = { app, httpServer };