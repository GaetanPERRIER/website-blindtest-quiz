const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth');

router.get('/google', (req, res) => authController.googleLogin(req, res));
router.get('/callback', (req, res) => authController.callback(req, res));
router.get('/me', requireAuth, (req, res) => authController.getMe(req, res));
router.post('/logout', requireAuth, (req, res) => authController.logout(req, res));

module.exports = router;
