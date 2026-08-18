const express = require('express');
const router = express.Router();
const MusicController = require('../controllers/music.controller');
const { requireAuth } = require('../middleware/auth');
const requireAdmin = require('../middleware/admin');

// GET /api/music/get-categories (maybe deprecated)
router.get('/get-categories', MusicController.getCategories);



// GET /api/music/list-playlists
router.get('/list-playlists', MusicController.ListPlaylist)

// GET /api/music/get-playlist-details
router.get('/get-playlist-details/:id', MusicController.GetPlaylistDetails)

// POST  /api/music/create-playlist
router.post('/create-playlist', requireAuth, requireAdmin, MusicController.createPlaylist)

// GET /api/music/sync-playlists
router.get('/sync-playlists', requireAuth, requireAdmin, MusicController.SyncPlaylists)

module.exports = router;
