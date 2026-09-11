const MusicService = require("../services/music.service");

function asyncHandler(label, handler) {
    return async (req, res) => {
        try {
            await handler(req, res);
        } catch (error) {
            console.error(`${label}:`, error.message);
            res.status(error.status || 500).json({ error: error.message });
        }
    };
}

class MusicController {
    ListPlaylist = asyncHandler('Failed to get playlists', async (req, res) => {
        const data = await MusicService.ListPlaylists();
        res.json(data);
    });

    GetPlaylistDetails = asyncHandler('Failed to get playlist details', async (req, res) => {
        const data = await MusicService.GetPlaylistDetails(req.params.id);
        res.json(data);
    });

    createPlaylist = asyncHandler('Failed to create playlist', async (req, res) => {
        const data = await MusicService.CreatePlaylist(req.body.playlistName);
        res.status(201).json(data);
    });

    deletePlaylist = asyncHandler('Failed to delete playlist', async (req, res) => {
        const data = await MusicService.DeletePlaylist(req.params.id);
        res.json(data);
    });

    SyncPlaylists = asyncHandler('Failed to synchronize playlists', async (req, res) => {
        const data = await MusicService.SyncPlaylists();
        res.json(data);
    });

    searchTracks = asyncHandler('Failed to search tracks', async (req, res) => {
        const data = await MusicService.SearchTracks(req.query.q);
        res.json(data);
    });

    addSong = asyncHandler('Failed to add song to playlist', async (req, res) => {
        const data = await MusicService.AddSong(req.params.playlistId, req.body.spotifyTrackId);
        res.status(201).json(data);
    });

    removeSong = asyncHandler('Failed to remove song from playlist', async (req, res) => {
        const data = await MusicService.RemoveSong(req.params.playlistId, req.params.songId);
        res.json(data);
    });
}

module.exports = new MusicController();
