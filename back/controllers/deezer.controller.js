const DeezerService = require("../services/deezer.service");
const { DEEZER_API } = require("../config/constants");

class DeezerController {
    async getCategories(req, res) {
        try {
            const url = DEEZER_API.BASE_URL + DEEZER_API.CHART_ENDPOINT
            const data = await DeezerService.fetchFromDeezer(url)
            res.json(data)
        } catch (error) {
            res.status(500).json({error : "Failed to fetch categories"})
        }
    }

    async startBlindtest (req, res){
        const { trackListUrl } = req.body;
        if (!trackListUrl) return res.status(400).json({ error: "trackListUrl is required" });

        try {
            const data = await DeezerService.fetchFromDeezer(trackListUrl);
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: "Failed to start blindtest" });
        }
    }
}

module.exports = new DeezerController();