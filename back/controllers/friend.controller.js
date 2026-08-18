const FriendService = require('../services/friend.service');

class FriendController {
    async search(req, res) {
        try {
            const users = await FriendService.searchUsers(req.query.q, req.user.id);
            res.json(users);
        } catch (error) {
            console.error('Failed to search users:', error.message);
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    async listFriends(req, res) {
        try {
            const friends = await FriendService.getFriends(req.user.id);
            res.json(friends);
        } catch (error) {
            console.error('Failed to list friends:', error.message);
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    async listPendingRequests(req, res) {
        try {
            const requests = await FriendService.getPendingRequests(req.user.id);
            res.json(requests);
        } catch (error) {
            console.error('Failed to list pending requests:', error.message);
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    async sendRequest(req, res) {
        try {
            await FriendService.sendFriendRequest(req.user.id, req.body.friendId);
            res.json({ success: true });
        } catch (error) {
            console.error('Failed to send friend request:', error.message);
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    async acceptRequest(req, res) {
        try {
            await FriendService.acceptRequest(req.params.requestId, req.user.id);
            res.json({ success: true });
        } catch (error) {
            console.error('Failed to accept friend request:', error.message);
            res.status(error.status || 500).json({ error: error.message });
        }
    }

    async removeFriend(req, res) {
        try {
            await FriendService.removeFriend(req.user.id, req.params.friendId);
            res.json({ success: true });
        } catch (error) {
            console.error('Failed to remove friend:', error.message);
            res.status(error.status || 500).json({ error: error.message });
        }
    }
}

module.exports = new FriendController();
