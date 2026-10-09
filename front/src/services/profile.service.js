const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const profileService = {
    async updateProfile(token, { username, avatar_url }) {
        let response;
        try {
            response = await fetch(`${API_URL}/api/profile/me`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ username, avatar_url })
            });
        } catch {
            throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.');
        }

        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || 'Échec de la mise à jour du profil.');

        return data;
    }
};
