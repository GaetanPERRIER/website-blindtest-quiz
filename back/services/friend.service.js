const friendRepository = require('../repositories/friend.repository');

class FriendService {
    async searchUsers(query, currentUserId) {
        const trimmed = (query ?? '').trim();
        if (trimmed.length < 3) return [];

        return await friendRepository.searchUsers(trimmed, currentUserId);
    }

    async getFriends(userId) {
        const friendships = await friendRepository.getFriendships(userId);
        if (friendships.length === 0) return [];

        const friendIds = friendships.map(f => f.user_id === userId ? f.friend_id : f.user_id);
        return await friendRepository.getProfilesByIds(friendIds);
    }

    async sendFriendRequest(userId, friendId) {
        if (!friendId || friendId === userId) {
            const error = new Error('Destinataire invalide.');
            error.status = 400;
            throw error;
        }

        const existing = await friendRepository.findExistingFriendship(userId, friendId);
        if (existing?.length > 0) return; // deja existant, on ne recree pas

        await friendRepository.createFriendRequest(userId, friendId);
    }

    async getPendingRequests(userId) {
        const requests = await friendRepository.getPendingRequests(userId);
        if (requests.length === 0) return [];

        const userIds = requests.map(r => r.user_id);
        const profiles = await friendRepository.getProfilesByIds(userIds);

        return requests.map(r => ({
            id: r.id,
            user: profiles.find(p => p.id === r.user_id)
        }));
    }

    async acceptRequest(requestId, currentUserId) {
        const friendship = await friendRepository.findFriendshipById(requestId);

        if (!friendship || friendship.friend_id !== currentUserId) {
            const error = new Error('Demande introuvable.');
            error.status = 404;
            throw error;
        }
        if (friendship.status !== 'pending') {
            const error = new Error('Cette demande a deja ete traitee.');
            error.status = 409;
            throw error;
        }

        await friendRepository.acceptFriendship(requestId);
    }

    async removeFriend(userId, friendId) {
        await friendRepository.deleteFriendship(userId, friendId);
    }
}

module.exports = new FriendService();
