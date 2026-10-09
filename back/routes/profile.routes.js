const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/profile.controller');
const { requireAuth } = require('../middleware/auth');

// PATCH /api/profile/me
router.patch('/me', requireAuth, (req, res) => ProfileController.updateMe(req, res));

module.exports = router;
