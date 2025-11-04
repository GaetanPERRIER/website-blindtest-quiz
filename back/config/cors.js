const { FRONTEND_ORIGINS } = require("./constants");

const allowedOrigins = FRONTEND_ORIGINS;

const corsOptions = {
    origin: (origin, callback) => {
        // Autorise les requêtes sans origine (Postman, curl, etc.) uniquement en développement
        if (!origin) {
            if (process.env.NODE_ENV === 'development') {
                return callback(null, true);
            }
            return callback(new Error('Origin header required'));
        }

        if (allowedOrigins.includes(origin)) {
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