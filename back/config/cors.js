const { CLIENT_URL } = require('./constants');

// CLIENT_URL est la source de verite pour l'origine de production (meme
// variable d'env que celle utilisee par Socket.IO dans server.js). Les
// origines localhost restent autorisees pour le dev.
const allowedOrigins = [
    CLIENT_URL,
    'http://localhost:5173',
    'http://127.0.0.1:5173'
];

const corsOptions = {
    origin: (origin, callback) => {
        // Autorise les requêtes sans origine (Postman, curl, etc.) en développement
        if (process.env.NODE_ENV === 'development' && !origin) {
            return callback(null, true);
        }

        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept'
    ],
    credentials: true,
    optionsSuccessStatus: 200 // Pour les anciens navigateurs
};

// Configuration spécifique pour Socket.IO
const socketCorsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
};

module.exports = {
    corsOptions,
    socketCorsOptions
};