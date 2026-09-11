const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function request(path, { token, ...options } = {}) {
    let response
    try {
        response = await fetch(`${API_URL}/api/music${path}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...(options.headers || {})
            }
        })
    } catch {
        throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.')
    }

    const data = await response.json().catch(() => null)
    if (!response.ok) {
        throw new Error(data?.error || `HTTP error: ${response.status}`)
    }
    return data
}

export const musicService = {
    /**
     * List every playlist stored in database, with its song count
     */
    async listPlaylists() {
        return await request('/list-playlists')
    },

    /**
     * Get one playlist with its ordered tracklist
     */
    async getPlaylistDetails(playlistId) {
        return await request(`/get-playlist-details/${playlistId}`)
    },

    /**
     * Create a playlist (Spotify + database) — admin only
     */
    async createPlaylist(playlistName, token) {
        return await request('/create-playlist', {
            token,
            method: 'POST',
            body: JSON.stringify({ playlistName })
        })
    },

    /**
     * Delete a playlist (Spotify + database) — admin only
     */
    async deletePlaylist(playlistId, token) {
        return await request(`/delete-playlist/${playlistId}`, { token, method: 'DELETE' })
    },

    /**
     * Synchronize every Spotify playlist into the database — admin only
     */
    async syncPlaylists(token) {
        return await request('/sync-playlists', { token })
    },

    /**
     * Search tracks on Spotify — admin only
     */
    async searchTracks(query, token) {
        return await request(`/search-tracks?q=${encodeURIComponent(query)}`, { token })
    },

    /**
     * Add a Spotify track to a playlist — admin only
     */
    async addSong(playlistId, spotifyTrackId, token) {
        return await request(`/add-song/${playlistId}`, {
            token,
            method: 'POST',
            body: JSON.stringify({ spotifyTrackId })
        })
    },

    /**
     * Remove a song from a playlist — admin only
     */
    async removeSong(playlistId, songId, token) {
        return await request(`/remove-song/${playlistId}/${songId}`, { token, method: 'DELETE' })
    },
}
