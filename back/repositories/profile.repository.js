const supabase = require('../config/db');

class ProfileRepository {
    async findByIdWithRole(userId) {

        const { data, error } = await supabase
            .from('profiles')
            .select(`
                id,
                username,
                avatar_url,
                id_role,
                roles!profiles_id_role_fkey ( role )
            `)
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    }

    async updateProfile(userId, { username, avatar_url }) {
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                username,
                avatar_url,
                updated_at: new Date().toISOString()
            })
            .select('username, avatar_url')
            .single();

        if (error) throw error;
        return data;
    }
}

module.exports = new ProfileRepository();
