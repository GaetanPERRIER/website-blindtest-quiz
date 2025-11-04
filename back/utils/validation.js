const { DEEZER_API, GAME_RULES } = require("../config/constants");

function isAllowedHostname(hostname) {
    return DEEZER_API.ALLOWED_HOSTS.includes(hostname.toLowerCase());
}

function assertAllowedDeezerUrl(urlString, fieldName = "url") {
    let parsedUrl;
    try {
        parsedUrl = new URL(urlString);
    } catch (error) {
        throw new Error(`${fieldName} invalide`);
    }

    if (!isAllowedHostname(parsedUrl.hostname)) {
        throw new Error(`${fieldName} non autorisée`);
    }

    return parsedUrl.toString();
}

function sanitizeUsername(username) {
    if (typeof username !== "string") {
        throw new Error("Nom d'utilisateur invalide");
    }

    const trimmed = username.trim();
    if (trimmed.length === 0 || trimmed.length > 20) {
        throw new Error("Nom d'utilisateur invalide");
    }

    return trimmed;
}

function assertValidDifficulty(difficulty) {
    if (!GAME_RULES.DIFFICULTIES.includes(difficulty)) {
        throw new Error("Difficulté invalide");
    }
    return difficulty;
}

function assertValidSongCount(value) {
    const numeric = Number(value);

    if (
        Number.isNaN(numeric) ||
        numeric < GAME_RULES.MIN_SONG_COUNT ||
        numeric > GAME_RULES.MAX_SONG_COUNT
    ) {
        throw new Error("Nombre de morceaux invalide");
    }

    return numeric;
}

module.exports = {
    assertAllowedDeezerUrl,
    sanitizeUsername,
    assertValidDifficulty,
    assertValidSongCount
};

