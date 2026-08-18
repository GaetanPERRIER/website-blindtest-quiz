const profileRepository = require('../repositories/profile.repository');

const USERNAME_MAX_LENGTH = 20;

class ProfileService {
    async updateProfile(userId, { username, avatar_url }) {
        const trimmedUsername = (username ?? '').trim();

        if (trimmedUsername === '') {
            const error = new Error('Le pseudo ne peut pas être vide.');
            error.status = 400;
            throw error;
        }
        if (trimmedUsername.length > USERNAME_MAX_LENGTH) {
            const error = new Error(`Le pseudo ne doit pas dépasser ${USERNAME_MAX_LENGTH} caractères.`);
            error.status = 400;
            throw error;
        }

        return await profileRepository.updateProfile(userId, {
            username: trimmedUsername,
            avatar_url: avatar_url || null
        });
    }
}

module.exports = new ProfileService();
