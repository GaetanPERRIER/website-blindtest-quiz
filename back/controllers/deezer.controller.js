const DeezerService = require("../services/deezer.service");
const { DEEZER_API } = require("../config/constants");

class DeezerController {
    async getCategories(req, res) {
        try {
            const url = DEEZER_API.BASE_URL + DEEZER_API.CHART_ENDPOINT;
            const data = await DeezerService.fetchFromDeezer(url, "categories");
            res.json(data);
        } catch (error) {
            res.status(502).json({ error: error.message || "Impossible de récupérer les catégories" });
        }
    }

    async startBlindtest(req, res) {
        const { trackListUrl } = req.body;
        if (typeof trackListUrl !== "string" || !trackListUrl.trim()) {
            return res.status(400).json({ error: "trackListUrl requis" });
        }

        try {
            const data = await DeezerService.fetchFromDeezer(trackListUrl, "trackListUrl");
            res.json(data);
        } catch (error) {
            res.status(502).json({ error: error.message || "Impossible de démarrer le blindtest" });
        }
    }
}

module.exports = new DeezerController();