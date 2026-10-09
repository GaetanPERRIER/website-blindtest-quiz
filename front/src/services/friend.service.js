const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

async function request(path, token, options = {}) {
    const response = await fetch(`${API_URL}/api/friends${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...(options.headers || {})
        }
    })

    const data = await response.json().catch(() => null)
    if (!response.ok) {
        throw new Error(data?.error || `HTTP error: ${response.status}`)
    }
    return data
}

export const friendService = {
    /**
     * Search for users by username
     */
    async searchUsers(query, token) {
        return await request(`/search?q=${encodeURIComponent(query)}`, token)
    },

    /**
     * Get current user's friends
     */
    async getFriends(token) {
        return await request('/', token)
    },

    /**
     * Send a friend request
     */
    async sendFriendRequest(friendId, token) {
        return await request('/requests', token, {
            method: 'POST',
            body: JSON.stringify({ friendId })
        })
    },

    /**
     * Get pending friend requests
     */
    async getPendingRequests(token) {
        return await request('/requests/pending', token)
    },

    /**
     * Accept friend request
     */
    async acceptRequest(requestId, token) {
        return await request(`/requests/${requestId}/accept`, token, { method: 'POST' })
    },

    /**
     * Remove friendship
     */
    async removeFriend(friendId, token) {
        return await request(`/${friendId}`, token, { method: 'DELETE' })
    },
}
