const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const profileService = {
    async updateProfile(token, { username, avatar_url }) {
        const response = await fetch(`${API_URL}/api/profile/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ username, avatar_url })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Échec de la mise à jour du profil.');

        return data;
    }
};
