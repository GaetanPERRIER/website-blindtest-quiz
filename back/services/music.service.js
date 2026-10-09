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

    // Appel générique à l'API Spotify, avec le token admin et la gestion d'erreur
    async spotifyFetch(endpoint, options = {}) {
        const token = await this.getAccessToken()

        const response = await fetch(`${this.spotifyUrl}${endpoint}`, {
            ...options,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                ...(options.headers || {})
            }
        })

        if (!response.ok) {
            const error = await response.json().catch(() => null)
            throw new Error(`Erreur API Spotify (${endpoint}): ${error?.error?.message || response.statusText}`)
        }

        // Spotify renvoie un corps vide sur certaines opérations (unfollow par ex.)
        const body = await response.text()
        return body ? JSON.parse(body) : null
    }

    // Charge une playlist en base ou lève une 404 exploitable par le controller
    async getPlaylistOrThrow(playlistId) {
        const playlist = await MusicRepository.GetPlaylistById(playlistId)

        if (!playlist) {
            const error = new Error('Playlist introuvable.')
            error.status = 404
            throw error
        }

        return playlist
    }

    //  Get all playlists available
    async ListPlaylists(){
        return await MusicRepository.ListPlaylists()
    }

    // Create a spotify playlist
    async CreatePlaylist(playlistName) {
        const name = (playlistName ?? '').trim()

        if (!name) {
            const error = new Error('Le nom de la playlist est obligatoire.')
            error.status = 400
            throw error
        }

        // Call l'api spotify pour créer une playlist
        const data = await this.spotifyFetch('/me/playlists', {
            method: 'POST',
            body: JSON.stringify({ name, public: false })
        })

        // Enboyer le retour de l'api (playliste id etc... ) dans le repo pour ajout en base
        return await MusicRepository.AddPlaylist(data)
    }

    // Delete a playlist : unfollow côté Spotify (l'API n'expose pas de suppression)
    // puis retrait de la base, sinon le prochain SyncPlaylists la réimporterait
    async DeletePlaylist(playlistId) {
        const playlist = await this.getPlaylistOrThrow(playlistId)

        await this.spotifyFetch(`/playlists/${playlist.spotify_playlist_id}/followers`, {
            method: 'DELETE'
        })

        await MusicRepository.DeletePlaylist(playlist.id)

        return { id: playlist.id, name: playlist.name }
    }


    async GetPlaylistDetails(idPlaylist){
        return await MusicRepository.GetPlaylistDetails(idPlaylist)
    }

    // Search tracks on Spotify, pour alimenter l'ajout de morceaux depuis le backoffice.
    // limit est plafonné à 10 : au-delà, /search répond "Invalid limit" sur une app
    // Spotify en mode développement.
    async SearchTracks(query, limit = 10) {
        const trimmed = (query ?? '').trim()
        if (trimmed.length < 2) return []

        const data = await this.spotifyFetch(
            `/search?q=${encodeURIComponent(trimmed)}&type=track&limit=${limit}`
        )

        return (data?.tracks?.items ?? [])
            .filter(track => track?.id)
            .map(track => ({
                spotify_track_id: track.id,
                title: track.name,
                artist: track.artists?.map(a => a.name).join(', ') ?? 'Unknown',
                cover_url: track.album?.images?.[0]?.url ?? null,
                album: track.album?.name ?? null,
            }))
    }

    // Add a song to a playlist (Spotify + base, pour rester cohérent avec SyncPlaylists)
    async AddSong(playlistId, spotifyTrackId) {
        const playlist = await this.getPlaylistOrThrow(playlistId)

        if (!spotifyTrackId) {
            const error = new Error('Identifiant du morceau manquant.')
            error.status = 400
            throw error
        }

        const track = await this.spotifyFetch(`/tracks/${spotifyTrackId}`)
        const artist = track.artists?.map(a => a.name).join(', ') ?? 'Unknown'

        // Fallback iTunes si Spotify ne fournit pas de preview, comme pour le sync
        const previewUrl = track.preview_url ?? await this.getItunesPreviewUrl(track.name, artist)

        // If the song doesnt exist in "songs" add it, then add the relation in "playlist_songs"
        const song = await MusicRepository.UpsertSong({
            spotify_track_id: track.id,
            title: track.name,
            artist,
            cover_url: track.album?.images?.[0]?.url ?? null,
            preview_url: previewUrl,
        })

        if (await MusicRepository.IsSongInPlaylist(playlist.id, song.id)) {
            const error = new Error('Ce morceau est déjà dans la playlist.')
            error.status = 409
            throw error
        }

        // /items et non /tracks : comme pour la lecture dans getPlaylistTracks,
        // l'endpoint /tracks répond 403 sur cette application Spotify
        await this.spotifyFetch(`/playlists/${playlist.spotify_playlist_id}/items`, {
            method: 'POST',
            body: JSON.stringify({ uris: [`spotify:track:${track.id}`] })
        })

        await MusicRepository.AddSongToPlaylist(playlist.id, song.id)

        return song
    }

    // Delete a song from a playlist (le morceau reste dans la table songs)
    async RemoveSong(playlistId, songId) {
        const playlist = await this.getPlaylistOrThrow(playlistId)
        const song = await MusicRepository.GetSongById(songId)

        if (!song) {
            const error = new Error('Morceau introuvable.')
            error.status = 404
            throw error
        }

        // Le retrait attend items: [{ uri }] là où l'ajout attend uris: [...]
        await this.spotifyFetch(`/playlists/${playlist.spotify_playlist_id}/items`, {
            method: 'DELETE',
            body: JSON.stringify({ items: [{ uri: `spotify:track:${song.spotify_track_id}` }] })
        })

        // remove the link "playlist_songs"
        await MusicRepository.RemoveSongFromPlaylist(playlist.id, song.id)

        return { id: song.id, title: song.title }
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
