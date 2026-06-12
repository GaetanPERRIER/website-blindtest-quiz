const MusicService = require("../services/music.service");

class MusicController {
    async getCategories(req, res) {
        try {
            const data = await MusicService.getCategories();
            res.json(data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            res.status(500).json({ error: "Failed to fetch categories" });
        }
    }
}

module.exports = new MusicController();
