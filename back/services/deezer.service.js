
class DeezerService {
    async fetchFromDeezer(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error("API Deezer error");
        return response.json();
    }
}

module.exports = new DeezerService();