class SpotifyService {
    constructor() {
        this.clientId = process.env.SPOTIFY_CLIENT_ID;
        this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        this.accessToken = null;
        this.tokenExpiresAt = 0;
    }

    async getAccessToken() {
        if (this.accessToken && Date.now() < this.tokenExpiresAt) {
            return this.accessToken;
        }

        const authString = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials'
        });

        if (!response.ok) {
            throw new Error('Failed to get Spotify access token');
        }

        const data = await response.json();
        this.accessToken = data.access_token;
        this.tokenExpiresAt = Date.now() + (data.expires_in * 1000) - 60000; // 1 minute buffer
        return this.accessToken;
    }

    async fetchFromSpotify(endpoint) {
        const token = await this.getAccessToken();
        const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            if (response.status === 401) {
                this.accessToken = null; // Token expired
                return this.fetchFromSpotify(endpoint);
            }
            throw new Error(`Spotify API error: ${response.statusText}`);
        }

        return response.json();
    }

    async getCategories() {
        // En Spotify, on peut récupérer des playlists de catégories ou des playlists "featured"
        // Pour correspondre à l'ancienne logique Deezer (charts), on va chercher des playlists populaires
        const data = await this.fetchFromSpotify('/browse/featured-playlists?limit=20');
        return {
            playlists: {
                data: data.playlists.items.map(item => ({
                    id: item.id,
                    title: item.name,
                    picture_big: item.images[0]?.url,
                    tracklist: `/playlists/${item.id}/tracks`
                }))
            }
        };
    }

    async getPlaylistTracks(playlistId) {
        const data = await this.fetchFromSpotify(`/playlists/${playlistId}/tracks?limit=100`);
        return data.items
            .filter(item => item.track && item.track.preview_url) // Important: Spotify n'a pas toujours de preview_url
            .map(item => ({
                id: item.track.id,
                title: item.track.name,
                artist: item.track.artists.map(a => a.name).join(', '),
                preview: item.track.preview_url,
                album_cover: item.track.album.images[0]?.url,
                rank: item.track.popularity // Popularity 0-100
            }));
    }
}

module.exports = new SpotifyService();
