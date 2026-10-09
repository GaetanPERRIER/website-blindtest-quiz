const express = require('express');
const router = express.Router();
const FriendController = require('../controllers/friend.controller');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// GET /api/friends/search?q=...
router.get('/search', (req, res) => FriendController.search(req, res));

// GET /api/friends
router.get('/', (req, res) => FriendController.listFriends(req, res));

// GET /api/friends/requests/pending
router.get('/requests/pending', (req, res) => FriendController.listPendingRequests(req, res));

// POST /api/friends/requests  { friendId }
router.post('/requests', (req, res) => FriendController.sendRequest(req, res));

// POST /api/friends/requests/:requestId/accept
router.post('/requests/:requestId/accept', (req, res) => FriendController.acceptRequest(req, res));

// DELETE /api/friends/:friendId
router.delete('/:friendId', (req, res) => FriendController.removeFriend(req, res));

module.exports = router;
