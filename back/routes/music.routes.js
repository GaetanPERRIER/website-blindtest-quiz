const express = require('express');
const router = express.Router();
const MusicController = require('../controllers/music.controller');

// GET /api/music/get-categories (maybe deprecated)
router.get('/get-categories', MusicController.getCategories);



// GET /api/music/list-playlists
router.get('/list-playlists', MusicController.ListPlaylist)

// GET /api/music/get-playlist-details
router.get('/get-playlist-details/:id', MusicController.GetPlaylistDetails)

// POST  /api/music/create-playlist
router.post('/create-playlist', MusicController.createPlaylist)

// GET /api/music/sync-playlists
router.get('/sync-playlists', MusicController.SyncPlaylists)

module.exports = router;
