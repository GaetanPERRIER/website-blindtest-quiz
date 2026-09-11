const express = require('express');
const router = express.Router();
const MusicController = require('../controllers/music.controller');
const { requireAuth } = require('../middleware/auth');
const requireAdmin = require('../middleware/admin');

// GET /api/music/list-playlists
router.get('/list-playlists', MusicController.ListPlaylist)

// GET /api/music/get-playlist-details
router.get('/get-playlist-details/:id', MusicController.GetPlaylistDetails)

// POST  /api/music/create-playlist
router.post('/create-playlist', requireAuth, requireAdmin, MusicController.createPlaylist)

// DELETE /api/music/delete-playlist/:id
router.delete('/delete-playlist/:id', requireAuth, requireAdmin, MusicController.deletePlaylist)

// GET /api/music/sync-playlists
router.get('/sync-playlists', requireAuth, requireAdmin, MusicController.SyncPlaylists)

// GET /api/music/search-tracks?q=...
router.get('/search-tracks', requireAuth, requireAdmin, MusicController.searchTracks)

// POST /api/music/add-song/:playlistId  { spotifyTrackId }
router.post('/add-song/:playlistId', requireAuth, requireAdmin, MusicController.addSong)

// DELETE /api/music/remove-song/:playlistId/:songId
router.delete('/remove-song/:playlistId/:songId', requireAuth, requireAdmin, MusicController.removeSong)

module.exports = router;
