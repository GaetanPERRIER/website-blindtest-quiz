import { supabase } from './supabase'

export const friendService = {
  /**
   * Search for users by username
   */
  async searchUsers(query) {
      const { data, error } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .ilike('username', `%${query}%`)
          .limit(10)

      if (error) throw error
      return data
  },

  /**
   * Get current user's friends
   */
  async getFriends(userId) {
      const { data: friendships, error } = await supabase
          .from('friendships')
          .select('user_id, friend_id')
          .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
          .eq('status', 'accepted')

      if (error) throw error
      if (!friendships.length) return []

      const friendIds = friendships.map(f =>
          f.user_id === userId ? f.friend_id : f.user_id
      )

      const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', friendIds)

      if (profilesError) throw profilesError
      console.log('friends:', profiles)
      return profiles
  },

  /**
   * Send a friend request
   */
  async sendFriendRequest(userId, friendId) {
      // Vérifie qu'il n'existe pas déjà une demande dans l'un ou l'autre sens
      const { data: existing } = await supabase
          .from('friendships')
          .select('id')
          .or(
              `and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`
          )
          .limit(1)

      if (existing?.length > 0) return // déjà existant, on ne recrée pas

      const { error } = await supabase
          .from('friendships')
          .insert({ user_id: userId, friend_id: friendId, status: 'pending' })

      if (error) throw error
  },

  /**
   * Get pending friend requests
   */
  async getPendingRequests(userId) {
      const { data: requests, error } = await supabase
          .from('friendships')
          .select('id, user_id')
          .eq('friend_id', userId)
          .eq('status', 'pending')

      if (error) throw error
      if (!requests.length) return []

      const userIds = requests.map(r => r.user_id)
      const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, avatar_url')
          .in('id', userIds)

      if (profilesError) throw profilesError

      return requests.map(r => ({
          id: r.id,
          user: profiles.find(p => p.id === r.user_id)
      }))
  },

  /**
   * Accept friend request
   */
  async acceptRequest(requestId) {
    const { error } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', requestId)
    
    if (error) throw error
  },

    /**
     * Remove friendship
     */
    async removeFriend(userId, friendId) {
        const { data, error } = await supabase
            .from('friendships')
            .delete()
            .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`)
            .select()

        console.log('deleted:', data, error)
        if (error) throw error
    },
}
