/**
 * Authentication Middleware
 * Verifies Supabase JWT tokens via Supabase Auth
 */
const supabase = require('../config/db');

const verifyToken = async (token) => {
    if (!supabase) {
        throw new Error('Supabase is not configured');
    }
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
        throw error || new Error('Invalid token');
    }
    return user;
};

const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return next();
    }

    const token = authHeader.split(' ')[1];

    try {
        req.user = await verifyToken(token);
        req.token = token;
    } catch (error) {
        console.error('JWT Verification failed:', error.message);
    }

    next();
};

const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];

    try {
        req.user = await verifyToken(token);
        req.token = token;
        next();
    } catch (error) {
        console.error('JWT Verification failed:', error.message);
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = optionalAuth;
module.exports.optionalAuth = optionalAuth;
module.exports.requireAuth = requireAuth;