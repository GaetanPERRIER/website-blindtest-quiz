module.exports = {
    DEFAULT_GAME_SETTINGS: {
        songCount: 10,
        maxSongCount: 20,
        maxPlayers: 6
    },
    DEEZER_API: {
        BASE_URL: process.env.DEEZER_API_BASE || "https://api.deezer.com",
        CHART_ENDPOINT: "/chart"
    },
    ROOM: {
        ID_LENGTH: 7
    },
    PORT: process.env.PORT || 3001,
    CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173"
};