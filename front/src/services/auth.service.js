const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const authService = {
    getGoogleLoginUrl() {
        return `${API_URL}/api/auth/google`;
    },

    async fetchMe(token) {
        const response = await fetch(`${API_URL}/api/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }

        return response.json();
    },

    async logout(token) {
        const response = await fetch(`${API_URL}/api/auth/logout`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to logout');
        }

        return response.json();
    }
};
