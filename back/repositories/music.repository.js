const supabase = require('../config/db');

class MusicRepository {

    // List all playlists with their song count
    async ListPlaylists(){
        const { data, error } = await supabase
            .from('playlists')
            .select(`
                *,
                playlist_songs(count)
            `)

        if (error) throw error;

        // Supabase renvoie playlist_songs sous forme [{ count: N }], on l'aplatit
        return data.map(playlist => ({
            ...playlist,
            song_count: playlist.playlist_songs?.[0]?.count ?? 0,
            playlist_songs: undefined, // on retire le champ brut imbriqué
        }))
    }

    // Add a playlist
    async AddPlaylist(playlistData) {
        const { data, error } = await supabase
            .from('playlists')
            .insert([
                {
                    spotify_playlist_id: playlistData.id,
                    name: playlistData.name,
                    cover_url: playlistData.images?.[0]?.url || null,
                    is_visible: false,
                    activation_date: null
                }
            ])
            .select()
            .single();

        if (error) {
            throw new Error(`DB error: ${error.message}`);
        }

        return data;
    }

    // Synchronize playlists between spotify and database
    async SyncPlaylists(spotifyPlaylists) {
        const incomingIds = spotifyPlaylists.map(p => p.spotify_playlist_id)

        // 1. Upsert : insère les nouvelles, met à jour les existantes
        const { data: upserted, error: upsertError } = await supabase
            .from('playlists')
            .upsert(
                spotifyPlaylists.map(p => ({
                    spotify_playlist_id: p.spotify_playlist_id,
                    name: p.name,
                    cover_url: p.cover_url,
                    updated_at: new Date().toISOString(),
                })),
                { onConflict: 'spotify_playlist_id' }
            )
            .select('id, spotify_playlist_id')

        if (upsertError) {
            throw new Error(`Erreur upsert playlists: ${upsertError.message}`)
        }

        // 2. Supprimer les playlists qui ne sont plus sur Spotify
        let deletedIds = []
        if (incomingIds.length > 0) {
            const { data: deleted, error: deleteError } = await supabase
                .from('playlists')
                .delete()
                .not('spotify_playlist_id', 'in', `(${incomingIds.join(',')})`)
                .select('id, spotify_playlist_id')

            if (deleteError) {
                throw new Error(`Erreur suppression playlists: ${deleteError.message}`)
            }
            deletedIds = deleted
        } else {
            const { data: deleted, error: deleteError } = await supabase
                .from('playlists')
                .delete()
                .select('id, spotify_playlist_id')

            if (deleteError) {
                throw new Error(`Erreur suppression playlists: ${deleteError.message}`)
            }
            deletedIds = deleted
        }

        return {
            playlists: upserted ?? [], // [{ id, spotify_playlist_id }, ...]
            deleted: deletedIds?.length ?? 0,
        }
    }

    // Synchronize songs (upsert global, indépendant des playlists)
    async SyncSongs(spotifyTracks) {
        if (spotifyTracks.length === 0) return []

        const { data: upserted, error } = await supabase
            .from('songs')
            .upsert(
                spotifyTracks.map(t => ({
                    spotify_track_id: t.spotify_track_id,
                    title: t.title,
                    artist: t.artist,
                    cover_url: t.cover_url,
                    preview_url: t.preview_url,
                    updated_at: new Date().toISOString(),
                })),
                { onConflict: 'spotify_track_id' }
            )
            .select('id, spotify_track_id')

        if (error) {
            throw new Error(`Erreur upsert songs: ${error.message}`)
        }

        return upserted // [{ id, spotify_track_id }, ...]
    }

    // Synchronize the link table playlist_songs for ONE playlist
    async SyncPlaylistSongs(playlistId, songEntries) {
        // songEntries: [{ song_id, position }, ...]

        // 1. Upsert des liens (insère/maj la position)
        if (songEntries.length > 0) {
            const { error: upsertError } = await supabase
                .from('playlist_songs')
                .upsert(
                    songEntries.map(s => ({
                        playlist_id: playlistId,
                        song_id: s.song_id,
                        position: s.position,
                    })),
                    { onConflict: 'playlist_id,song_id' }
                )

            if (upsertError) {
                throw new Error(`Erreur upsert playlist_songs: ${upsertError.message}`)
            }
        }

        // 2. Supprimer les liens des morceaux qui ne sont plus dans la playlist
        const currentSongIds = songEntries.map(s => s.song_id)

        let deleteQuery = supabase
            .from('playlist_songs')
            .delete()
            .eq('playlist_id', playlistId)

        if (currentSongIds.length > 0) {
            deleteQuery = deleteQuery.not('song_id', 'in', `(${currentSongIds.join(',')})`)
        }

        const { error: deleteError } = await deleteQuery

        if (deleteError) {
            throw new Error(`Erreur suppression playlist_songs: ${deleteError.message}`)
        }
    }

    // Get playlist details
    async GetPlaylistDetails(idPlaylist) {
        const { data, error } = await supabase
            .from('playlists')
            .select(`
                *,
                playlist_songs (
                    position,
                    songs (
                        id,
                        spotify_track_id,
                        title,
                        artist,
                        cover_url,
                        preview_url
                    )
                )
            `)
            .eq('id', idPlaylist)
            .single();

        if (error) {
            throw new Error(`Erreur récupération playlist: ${error.message}`);
        }

        return {
            ...data,
            songs: (data.playlist_songs || [])
                .sort((a, b) => a.position - b.position)
                .map(item => ({
                    position: item.position,
                    ...item.songs
                }))
        };
    }
}

module.exports = new MusicRepository();