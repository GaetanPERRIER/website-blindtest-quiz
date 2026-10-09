const ProfileService = require('../services/profile.service');

class ProfileController {
    async updateMe(req, res) {
        try {
            const profile = await ProfileService.updateProfile(req.user.id, req.body);
            res.json(profile);
        } catch (error) {
            console.error('Failed to update profile:', error.message);
            res.status(error.status || 500).json({ error: error.message });
        }
    }
}

module.exports = new ProfileController();
