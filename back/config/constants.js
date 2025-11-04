const DEFAULT_ALLOWED_DEEZER_HOSTS = ["api.deezer.com"];

module.exports = {
    DEFAULT_GAME_SETTINGS: {
        songCount: 10,
        difficulty: "easy",
        maxPlayers: 6
    },
    GAME_RULES: {
        MIN_SONG_COUNT: 1,
        MAX_SONG_COUNT: 20,
        DIFFICULTIES: ["easy", "normal", "hard"]
    },
    DEEZER_API: {
        BASE_URL: "https://api.deezer.com",
        CHART_ENDPOINT: "/chart",
        ALLOWED_HOSTS: process.env.DEEZER_ALLOWED_HOSTS?.split(",").map((host) => host.trim()).filter(Boolean) || DEFAULT_ALLOWED_DEEZER_HOSTS
    },
    ROOM: {
        ID_LENGTH: 7
    },
    PORT: Number(process.env.PORT) || 3001,
    FRONTEND_ORIGINS: process.env.FRONTEND_ORIGINS?.split(",").map((origin) => origin.trim()).filter(Boolean) || [
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]
};