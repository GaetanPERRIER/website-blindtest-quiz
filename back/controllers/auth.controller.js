const AuthService = require('../services/auth.service');
const { CLIENT_URL } = require('../config/constants');

class AuthController {
    async googleLogin(req, res) {
        try {
            const url = await AuthService.getGoogleOAuthUrl();
            res.redirect(url);
        } catch (error) {
            console.error('Failed to initiate Google login:', error.message);
            res.status(500).json({ error: 'Failed to initiate Google login' });
        }
    }

    async callback(req, res) {
        const { code } = req.query;

        if (!code) {
            return res.redirect(`${CLIENT_URL}/login?error=missing_code`);
        }

        try {
            const { accessToken } = await AuthService.handleCallback(code);
            const redirectUrl = `${CLIENT_URL}/auth/callback?token=${encodeURIComponent(accessToken)}`;
            res.redirect(redirectUrl);
        } catch (error) {
            console.error('OAuth callback failed:', error.message);
            res.redirect(`${CLIENT_URL}/login?error=auth_failed`);
        }
    }

    async getMe(req, res) {
        try {
            const user = await AuthService.getCurrentUser(req.token);
            res.json(user);
        } catch (error) {
            console.error('Failed to fetch current user:', error.message);
            res.status(401).json({ error: 'Unauthorized' });
        }
    }

    async logout(req, res) {
        try {
            await AuthService.logout();
            res.json({ success: true });
        } catch (error) {
            console.error('Logout failed:', error.message);
            res.status(500).json({ error: 'Logout failed' });
        }
    }
}

module.exports = new AuthController();
