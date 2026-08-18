const profileRepository = require('../repositories/profile.repository');

const requireAdmin = async (req, res, next) => {
    try {
        const profile = await profileRepository.findByIdWithRole(req.user.id);

        if (profile?.roles?.role !== 'Admin') {
            return res.status(403).json({ error: 'Forbidden' });
        }

        req.profile = profile;
        next();
    } catch (error) {
        console.error('Admin check failed:', error.message);
        return res.status(403).json({ error: 'Forbidden' });
    }
};

module.exports = requireAdmin;
