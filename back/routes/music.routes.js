const express = require('express');
const router = express.Router();
const { getCategories } = require('../controllers/music.controller');

// GET /api/music/get-categories
router.get('/get-categories', getCategories);

module.exports = router;
