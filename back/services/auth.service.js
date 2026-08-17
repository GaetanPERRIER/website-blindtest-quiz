const supabase = require('../config/db');
const profileRepository = require('../repositories/profile.repository');
const { BACKEND_URL } = require('../config/constants');

class AuthService {
    async getGoogleOAuthUrl() {
        if (!supabase) {
            throw new Error('Supabase is not configured');
        }

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${BACKEND_URL}/api/auth/callback`,
                skipBrowserRedirect: true
            }
        });

        if (error) throw error;
        return data.url;
    }

    async handleCallback(code) {
        if (!supabase) {
            throw new Error('Supabase is not configured');
        }

        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;

        const user = await this.buildUserResponse(data.user);
        return {
            accessToken: data.session.access_token,
            user
        };
    }

    async getCurrentUser(accessToken) {
        if (!supabase) {
            throw new Error('Supabase is not configured');
        }

        const { data: { user }, error } = await supabase.auth.getUser(accessToken);
        if (error) throw error;

        return this.buildUserResponse(user);
    }

    async buildUserResponse(authUser) {
        let profile = null;

        try {
            profile = await profileRepository.findByIdWithRole(authUser.id);
        } catch {
            profile = null;
        }

        return {
            id: authUser.id,
            email: authUser.email,
            username: profile?.username
                || authUser.user_metadata?.full_name
                || authUser.user_metadata?.name
                || '',
            avatar_url: profile?.avatar_url
                || authUser.user_metadata?.avatar_url
                || '',
            role: profile?.roles?.role || 'User'
        };
    }

    async logout() {
        return { success: true };
    }
}

module.exports = new AuthService();
