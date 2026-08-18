const FriendService = require('../services/friend.service');

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

class FriendController {
    search = asyncHandler('Failed to search users', async (req, res) => {
        const users = await FriendService.searchUsers(req.query.q, req.user.id);
        res.json(users);
    });

    listFriends = asyncHandler('Failed to list friends', async (req, res) => {
        const friends = await FriendService.getFriends(req.user.id);
        res.json(friends);
    });

    listPendingRequests = asyncHandler('Failed to list pending requests', async (req, res) => {
        const requests = await FriendService.getPendingRequests(req.user.id);
        res.json(requests);
    });

    sendRequest = asyncHandler('Failed to send friend request', async (req, res) => {
        await FriendService.sendFriendRequest(req.user.id, req.body.friendId);
        res.json({ success: true });
    });

    acceptRequest = asyncHandler('Failed to accept friend request', async (req, res) => {
        await FriendService.acceptRequest(req.params.requestId, req.user.id);
        res.json({ success: true });
    });

    removeFriend = asyncHandler('Failed to remove friend', async (req, res) => {
        await FriendService.removeFriend(req.user.id, req.params.friendId);
        res.json({ success: true });
    });
}

module.exports = new FriendController();
