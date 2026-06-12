const express = require('express');
const router = express.Router();
const { getCategories } = require('../controllers/deezer.controller');

// GET /api/deezer/get-categories
router.get('/get-categories', getCategories);

module.exports = router;
