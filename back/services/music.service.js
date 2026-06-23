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
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: process.env.SPOTIFY_REFRESH_TOKEN
            })
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error('Spotify refresh token error:', response.status, errorBody);
            throw new Error('Failed to refresh Spotify access token');
        }

        const data = await response.json();
        this.accessToken = data.access_token;
        this.tokenExpiresAt = Date.now() + (data.expires_in * 1000) - 60000;
        return this.accessToken;
    }

    async fetchFromSpotify(endpoint, retries = 3) {
        const token = await this.getAccessToken();
        const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log(`Spotify response: ${response.status} for ${endpoint}`);

        if (!response.ok) {
            if (retries <= 0) {
                throw new Error(`Spotify API error: ${response.statusText} (retries exhausted)`);
            }

            if (response.status === 429) {
                const retryAfter = parseInt(response.headers.get('Retry-After') || '1', 10);
                console.warn(`Rate limited, retrying in ${retryAfter}s...`);
                await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
                return this.fetchFromSpotify(endpoint, retries - 1);
            }

            if (response.status === 401) {
                console.warn('Token rejected, refreshing and retrying...');
                this.accessToken = null;
                return this.fetchFromSpotify(endpoint, retries - 1); // décrémenté !
            }

            throw new Error(`Spotify API error: ${response.statusText}`);
        }

        return response.json();
    }

    async getCategories() {
        const curatedPlaylists = require('../config/curatedPlaylists');

        const playlists = await Promise.all(
            curatedPlaylists.map(async ({ category, spotifyId }) => {
                const data = await this.fetchFromSpotify(`/playlists/${spotifyId}?fields=id,name,images`);
                return {
                    id: data.id,
                    title: data.name,
                    category,
                    picture_big: data.images[0]?.url,
                    tracklist: `/playlists/${data.id}/tracks`
                };
            })
        );
        return { playlists: { data: playlists } };
    }

    async getPreviewFromItunes(title, artist) {
        try {
            const query = encodeURIComponent(`${artist} ${title}`);
            const response = await fetch(
                `https://itunes.apple.com/search?term=${query}&media=music&entity=song&limit=1&country=FR`
            );
            if (!response.ok) return null;

            const data = await response.json();
            return data.results[0]?.previewUrl || null;
        } catch (error) {
            console.error(`iTunes search failed for "${artist} - ${title}":`, error.message);
            return null;
        }
    }

    async getPlaylistTracks(playlistId) {
        const data = await this.fetchFromSpotify(`/playlists/${playlistId}/items?limit=100`);
        const validItems = data.items.filter(item => item.item);

        const tracksWithPreviews = await Promise.all(
            validItems.map(async (item) => {
                const track = item.item;
                const artistName = track.artists.map(a => a.name).join(', ');
                const preview = await this.getPreviewFromItunes(track.name, track.artists[0]?.name);

                if (!preview) return null;

                return {
                    id: track.id,
                    title: track.name,
                    artist: artistName,
                    preview,
                    album_cover: track.album.images[0]?.url,
                    rank: track.popularity
                };
            })
        );

        return tracksWithPreviews.filter(Boolean);
    }
}

module.exports = new SpotifyService();
