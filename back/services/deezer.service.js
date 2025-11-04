const { assertAllowedDeezerUrl } = require("../utils/validation");

const fetchFn = global.fetch
    ? global.fetch.bind(global)
    : (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

class DeezerService {
    async fetchFromDeezer(url, fieldName = "url") {
        const safeUrl = assertAllowedDeezerUrl(url, fieldName);
        const response = await fetchFn(safeUrl);
        if (!response.ok) {
            throw new Error(`Erreur Deezer (${response.status})`);
        }
        return response.json();
    }
}

module.exports = new DeezerService();