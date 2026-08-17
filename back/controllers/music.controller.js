const MusicService = require("../services/music.service");

class MusicController {
    async ListPlaylist(req, res){
        try {
            const data = await MusicService.ListPlaylists()
            res.json(data)
        } catch (error) {
            console.error("Failed to get playlists", error)
            res.status(500).json({ error: "Failed to get playlists" });
        }
    }

    async GetPlaylistDetails(req, res) {
        try {
            const { id } = req.params;
            const data = await MusicService.GetPlaylistDetails(id);
            res.json(data);
        } catch (error) {
            console.error("Failed to get playlist details", error);
            res.status(500).json({ error: "Failed to get playlist details" });
        }
    }

    async createPlaylist(req, res) {
        try {
            const playlistName = req.body.playlistName            
            const data = await MusicService.CreatePlaylist(playlistName)

        } catch (error) {
            console.error("Failed to create playlist", error)
            res.status(500).json({ error: "Failed to create playlist" });
        }
    }

    async SyncPlaylists(req, res) {
        try {
            const data = await MusicService.SyncPlaylists();
            res.json(data);
        } catch (error) {
            console.error('Failed to synchronize playlists:', error);
            res.status(500).json({ error: "Failed to synchronize playlists" });
        }
    }






    //////////////////////////////////////////// plAYER
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
