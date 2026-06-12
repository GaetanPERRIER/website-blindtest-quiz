/**
 * Authentication Middleware
 * Verifies Supabase JWT tokens
 */
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return next(); // Laisse passer pour les invités
    }

    const token = authHeader.split(' ')[1];
    const jwtSecret = process.env.SUPABASE_JWT_SECRET;

    if (!jwtSecret) {
        console.warn('SUPABASE_JWT_SECRET is not defined in .env');
        return next();
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('JWT Verification failed:', error.message);
        // On laisse passer mais req.user sera null (invité)
        next();
    }
};

module.exports = authMiddleware;
