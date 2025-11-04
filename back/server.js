// Importations de base
const express = require('express');
const { createServer } = require('http');
const cors = require('cors')
const { Server } = require('socket.io');

// Configurations
const { corsOptions, socketCorsOptions } = require('./config/cors');
const { PORT } = require('./config/constants');

// Controllers
const { getCategories, startBlindtest } = require('./controllers/deezer.controller');

// Socket.IO
const setupSocketIO = require('./sockets/connection');

// Initialisation de l'application
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: socketCorsOptions
});

setupSocketIO(io);


// Middlewares
app.use(cors(corsOptions));
app.use(express.json()); // Pour parser le JSON des requêtes

// Routes API REST
app.get('/api/deezer/get-categories', getCategories);



// Démarrage du serveur
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Socket.IO ready for connections`);
});

// Export pour les tests (si nécessaire)
module.exports = { app, httpServer };