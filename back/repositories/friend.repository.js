const supabase = require('../config/db');

class FriendRepository {
    async searchUsers(query, excludeUserId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .ilike('username', `%${query}%`)
            .neq('id', excludeUserId)
            .limit(10);

        if (error) throw error;
        return data;
    }

    async getFriendships(userId) {
        const { data, error } = await supabase
            .from('friendships')
            .select('user_id, friend_id')
            .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
            .eq('status', 'accepted');

        if (error) throw error;
        return data;
    }

    async getProfilesByIds(ids) {
        if (ids.length === 0) return [];

        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .in('id', ids);

        if (error) throw error;
        return data;
    }

    async findExistingFriendship(userId, friendId) {
        const { data, error } = await supabase
            .from('friendships')
            .select('id')
            .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)
            .limit(1);

        if (error) throw error;
        return data;
    }

    async createFriendRequest(userId, friendId) {
        const { error } = await supabase
            .from('friendships')
            .insert({ user_id: userId, friend_id: friendId, status: 'pending' });

        if (error) throw error;
    }

    async getPendingRequests(userId) {
        const { data, error } = await supabase
            .from('friendships')
            .select('id, user_id')
            .eq('friend_id', userId)
            .eq('status', 'pending');

        if (error) throw error;
        return data;
    }

    async findFriendshipById(requestId) {
        const { data, error } = await supabase
            .from('friendships')
            .select('id, user_id, friend_id, status')
            .eq('id', requestId)
            .single();

        if (error) throw error;
        return data;
    }

    async acceptFriendship(requestId) {
        const { error } = await supabase
            .from('friendships')
            .update({ status: 'accepted' })
            .eq('id', requestId);

        if (error) throw error;
    }

    async deleteFriendship(userId, friendId) {
        const { error } = await supabase
            .from('friendships')
            .delete()
            .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);

        if (error) throw error;
    }
}

module.exports = new FriendRepository();
