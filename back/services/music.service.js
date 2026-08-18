const MusicRepository = require('../repositories/music.repository');


class SpotifyService {
    constructor() {
        this.clientId = process.env.SPOTIFY_CLIENT_ID;
        this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
        this.refreshToken = process.env.SPOTIFY_REFRESH_TOKEN
        this.accessToken = null;
        this.tokenExpiresAt = 0;
        this.spotifyUrl = "https://api.spotify.com/v1"
        this.userId = process.env.SPOTIFY_USER_ID
    }
    
    // Get the spotify AccessToken
    async getAccessToken() {
        // 1. Si token encore valide → on le renvoie
        if (this.accessToken && Date.now() < this.tokenExpiresAt) {
            return this.accessToken;
        }
    
        // 2. Sinon on refresh avec refresh_token
        if (!this.refreshToken) {
            throw new Error("No refresh token available. User must login with Spotify.");
        }
    
        const authString = Buffer.from(
            `${this.clientId}:${this.clientSecret}`
        ).toString('base64');
    
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: this.refreshToken
            })
        });
    
        if (!response.ok) {
            const error = await response.json();
            throw new Error(`Failed to refresh Spotify token: ${error.error_description || response.statusText}`);
        }
    
        const data = await response.json();
    
        // 3. Update tokens
        this.accessToken = data.access_token;
        this.tokenExpiresAt = Date.now() + (data.expires_in * 1000) - 60000;
    
        // ⚠️ parfois Spotify ne renvoie pas refresh_token → on garde l'ancien
        if (data.refresh_token) {
            this.refreshToken = data.refresh_token;
        }
    
        return this.accessToken;
    }

    //  Get all playlists available
    async ListPlaylists(){
        return await MusicRepository.ListPlaylists()
    }

    // Create a spotify playlist
    async CreatePlaylist(playlistName) {
        const token = await this.getAccessToken();
        console.log(token);
        
        // Call l'api spotify pour créer une playlist
        const url = `${this.spotifyUrl}/me/playlists`
        const response = await fetch(url, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: playlistName,
                public: false
            })
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(`Spotify error: ${error.error?.message || response.statusText}`)
        }
    
        const data = await response.json()

        // Enboyer le retour de l'api (playliste id etc... ) dans le repo pour ajout en base
        return await MusicRepository.AddPlaylist(data)
    }

    
    async GetPlaylistDetails(idPlaylist){
        return await MusicRepository.GetPlaylistDetails(idPlaylist)
    }

    // TODO : Add a song to a playlist 
    async AddSong(playlistId, song){
        // If the song doesnt exist in "songs" add it, the add the relation in "playlist_song"

        // Else, find it in "songs" then add the relation
    }

    // TODO :Delete a song from a playlist
    async RemoveSong(playlistId, songId){
        // remove the link "playlist_songs"
    }




    // TODO 
    async SyncPlaylists() {
        const token = await this.getAccessToken()
    
        // 1. Récupérer toutes les playlists Spotify (paginé)
        let spotifyPlaylists = []
        let url = `${this.spotifyUrl}/me/playlists?limit=50`
    
        while (url) {
            const response = await fetch(url, {
                method: "GET",
                headers: { 'Authorization': `Bearer ${token}` },
            })
    
            if (!response.ok) {
                throw new Error(`Erreur API Spotify (playlists): ${response.status} ${response.statusText}`)
            }
    
            const data = await response.json()
    
            spotifyPlaylists.push(...data.items.map(playlist => ({
                spotify_playlist_id: playlist.id,
                name: playlist.name,
                cover_url: playlist.images?.[0]?.url ?? null,
            })))
    
            url = data.next
        }
    
        // 2. Sync des playlists en base, on récupère le mapping id <-> spotify_playlist_id
        const { playlists: dbPlaylists, deleted } = await MusicRepository.SyncPlaylists(spotifyPlaylists)
    
        // 3. Pour chaque playlist, récupérer ses tracks et synchroniser songs + liaison
        for (const dbPlaylist of dbPlaylists) {
            const tracks = await this.getPlaylistTracks(dbPlaylist.spotify_playlist_id, token)
    
            if (tracks.length === 0) {
                // Playlist vide : on s'assure que les liens existants sont nettoyés
                await MusicRepository.SyncPlaylistSongs(dbPlaylist.id, [])
                continue
            }
    
            // Upsert des songs
            const songsPayload = tracks.map(t => ({
                spotify_track_id: t.spotify_track_id,
                title: t.title,
                artist: t.artist,
                cover_url: t.cover_url,
                preview_url: t.preview_url,
            }))
            const dbSongs = await MusicRepository.SyncSongs(songsPayload)
    
            // Mapping spotify_track_id -> id interne
            const songIdMap = new Map(dbSongs.map(s => [s.spotify_track_id, s.id]))
    
            // Construction des entrées de la table de liaison avec la position
            const songEntries = tracks
                .map((t, index) => ({
                    song_id: songIdMap.get(t.spotify_track_id),
                    position: index,
                }))
                .filter(entry => entry.song_id !== undefined)
    
            await MusicRepository.SyncPlaylistSongs(dbPlaylist.id, songEntries)
        }
    
        return {
            playlistsSynced: dbPlaylists.length,
            playlistsDeleted: deleted,
        }
    }
    

    async getPlaylistTracks(spotifyPlaylistId, token) {
        let tracks = []
        let url = `${this.spotifyUrl}/playlists/${spotifyPlaylistId}/items?limit=100`
    
        while (url) {
            const response = await fetch(url, {
                method: "GET",
                headers: { 'Authorization': `Bearer ${token}` },
            })
    
            if (!response.ok) {
                throw new Error(`Erreur API Spotify (tracks): ${response.status} ${response.statusText}`)
            }
    
            const data = await response.json()
    
            for (const entry of data.items) {
                const track = entry.item
                if (!track || !track.id) continue
    
                const artist = track.artists?.map(a => a.name).join(', ') ?? 'Unknown'
    
                // Fallback iTunes si Spotify ne fournit pas de preview
                let previewUrl = track.preview_url
                if (!previewUrl) {
                    previewUrl = await this.getItunesPreviewUrl(track.name, artist)
                }
    
                tracks.push({
                    spotify_track_id: track.id,
                    title: track.name,
                    artist,
                    cover_url: track.album?.images?.[0]?.url ?? null,
                    preview_url: previewUrl,
                })
            }
    
            url = data.next
        }
    
        return tracks
    }

    // Cherche un preview_url sur iTunes en fallback si Spotify n'en fournit pas
    async getItunesPreviewUrl(title, artist) {
        try {
            const term = encodeURIComponent(`${artist} ${title}`)
            const url = `https://itunes.apple.com/search?term=${term}&entity=song&limit=1`

            const response = await fetch(url)
            if (!response.ok) return null

            const data = await response.json()
            return data.results?.[0]?.previewUrl ?? null
        } catch (err) {
            console.error(`Erreur recherche iTunes pour "${title} - ${artist}":`, err.message)
            return null
        }
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
}

module.exports = new SpotifyService();
