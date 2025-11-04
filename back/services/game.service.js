const {
    DEFAULT_GAME_SETTINGS,
    GAME_RULES,
    SCORING,
    FUZZY_MATCHING
} = require('../config/constants');
const DeezerService = require('./deezer.service');
const { evaluateAnswerAgainstTrack } = require('../utils/answer-utils');

const ROUND_STATE_CONFIG = 'config';
const ROUND_STATE_GUESSING = 'guessing';
const ROUND_STATE_ANSWER = 'answer';
const ROUND_STATE_ENDED = 'ended';

const getRoundDuration = (room) => room.setting.roundDurationMs || DEFAULT_GAME_SETTINGS.roundDurationMs;

const computeComponentScore = (elapsedMs, maxPoints, roundDuration, minPoints) => {
    const safeDuration = Math.max(roundDuration, 1);
    const clampedElapsed = Math.max(0, Math.min(elapsedMs, safeDuration));
    const ratio = 1 - clampedElapsed / safeDuration;
    const rawScore = Math.round(maxPoints * ratio);
    return Math.max(minPoints, rawScore);
};

const ensureRoundCollections = (room) => {
    if (!Array.isArray(room.roundHistory)) {
        room.roundHistory = [];
    }

    if (!Array.isArray(room.currentRoundResults)) {
        room.currentRoundResults = [];
    }
};

const getRoundResultForPlayer = (room, player) => {
    ensureRoundCollections(room);
    let result = room.currentRoundResults.find((entry) => entry.playerId === player.socketId);
    if (!result) {
        result = {
            playerId: player.socketId,
            username: player.username,
            avatar: player.avatar || null,
            titleMatched: false,
            artistMatched: false,
            roundScore: 0,
            awardedHistory: [],
            totalScore: player.totalScore,
            firstSuccessMs: null,
            completionMs: null,
            lastElapsedMs: null
        };
        room.currentRoundResults.push(result);
    }
    return result;
};

const buildTrackSummary = (currentMusic) => ({
    title: currentMusic?.title_short || currentMusic?.title || null,
    artist: currentMusic?.artist?.name || null,
    album: currentMusic?.album?.title || null,
    cover: currentMusic?.album?.cover_medium || currentMusic?.album?.cover || currentMusic?.album?.cover_big || null
});

class GameService {
    constructor() {
    }

    async startGame(roomId, roomService) {
        const room = roomService.getRoom(roomId);

        if (!room.setting.category || !room.setting.category.tracklist) {
            throw new Error('Veuillez sélectionner une catégorie avant de démarrer la partie');
        }

        const nbMusics = room.setting.songCount ?? DEFAULT_GAME_SETTINGS.songCount;
        const difficulty = room.setting.difficulty ?? DEFAULT_GAME_SETTINGS.difficulty;
        const allTracks = await this.fetchTracks(room.setting.category.tracklist, nbMusics, difficulty);

        room.players.forEach((player) => {
            player.titleGuessed = false;
            player.artistGuessed = false;
            player.totalScore = 0;
            player.isReady = false;
            player.currentRoundScore = 0;
            player.firstCorrectAt = null;
            player.completedAt = null;
            player.roundHistory = [];
        });

        room.playlist = allTracks;
        room.round = -1;
        room.state = ROUND_STATE_CONFIG;
        room.gameStarted = true;
        room.roundStartAt = null;
        room.roundSummary = null;
        room.currentRoundResults = [];
        room.roundHistory = [];

        return room;
    }

    async fetchTracks(urlTracklist, count, difficulty) {
        let allTracks = [];
        let nextUrl = urlTracklist;

        while (nextUrl && allTracks.length < GAME_RULES.MAX_SONG_COUNT * 5) {
            const data = await DeezerService.fetchFromDeezer(nextUrl, 'trackListUrl');
            if (Array.isArray(data.data)) {
                allTracks = allTracks.concat(data.data);
            }
            nextUrl = data.next || null;
        }

        return this.chooseTracks(allTracks, count, difficulty);
    }

    chooseTracks(allTracks, songCount, difficulty) {
        let filteredTracks;
        switch (difficulty) {
            case 'easy':
                filteredTracks = allTracks.filter(track => track.rank >= 700000);
                break;
            case 'normal':
                filteredTracks = allTracks.filter(track => track.rank >= 300000 && track.rank < 700000);
                break;
            case 'hard':
                filteredTracks = allTracks.filter(track => track.rank < 300000);
                break;
            default:
                filteredTracks = allTracks;
        }

        if (filteredTracks.length < songCount) {
            filteredTracks = filteredTracks.concat(
                allTracks.filter(t => !filteredTracks.includes(t)).slice(0, songCount - filteredTracks.length)
            );
        }

        filteredTracks = filteredTracks.sort(() => Math.random() - 0.5).slice(0, songCount);
        return filteredTracks
    }

    nextRound(roomId, roomService) {
        const room = roomService.getRoom(roomId)

        room.round++

        if (room.round >= room.playlist.length) {
            room.state = ROUND_STATE_ENDED;
            return room;
        }

        room.currentMusic = room.playlist[room.round]
        room.state = ROUND_STATE_GUESSING
        room.roundStartAt = Date.now()
        room.roundSummary = null
        room.currentRoundResults = []

        room.players.forEach(player => {
            player.titleGuessed = false;
            player.artistGuessed = false;
            player.currentRoundScore = 0;
            player.firstCorrectAt = null;
            player.completedAt = null;
        });

        return room
    }

    endRound(roomId, roomService) {
        const room = roomService.getRoom(roomId)

        ensureRoundCollections(room)

        const roundDuration = getRoundDuration(room)
        const summary = {
            round: room.round,
            track: buildTrackSummary(room.currentMusic),
            durationMs: roundDuration,
            results: room.currentRoundResults
                .map((result) => {
                    const completionMs = typeof result.completionMs === 'number'
                        ? result.completionMs
                        : (result.titleMatched && result.artistMatched ? result.firstSuccessMs : null)

                    return {
                        ...result,
                        titleMatched: Boolean(result.titleMatched),
                        artistMatched: Boolean(result.artistMatched),
                        firstSuccessMs: typeof result.firstSuccessMs === 'number' ? result.firstSuccessMs : null,
                        completionMs: typeof completionMs === 'number' ? completionMs : null
                    }
                })
                .sort((a, b) => {
                    const aTime = typeof a.completionMs === 'number' ? a.completionMs : Infinity;
                    const bTime = typeof b.completionMs === 'number' ? b.completionMs : Infinity;
                    if (aTime === bTime) {
                        return b.roundScore - a.roundScore;
                    }
                    return aTime - bTime;
                })
        }

        room.roundSummary = summary

        const existingIndex = room.roundHistory.findIndex((entry) => entry.round === summary.round)
        if (existingIndex !== -1) {
            room.roundHistory[existingIndex] = summary
        } else {
            room.roundHistory.push(summary)
        }

        room.players.forEach((player) => {
            if (!Array.isArray(player.roundHistory)) {
                player.roundHistory = []
            }

            const firstSuccessMs = player.firstCorrectAt && room.roundStartAt
                ? player.firstCorrectAt - room.roundStartAt
                : null

            const completionMs = player.completedAt && room.roundStartAt
                ? player.completedAt - room.roundStartAt
                : (player.titleGuessed && player.artistGuessed && typeof firstSuccessMs === 'number' ? firstSuccessMs : null)

            player.roundHistory.push({
                round: room.round,
                score: player.currentRoundScore || 0,
                titleGuessed: Boolean(player.titleGuessed),
                artistGuessed: Boolean(player.artistGuessed),
                firstSuccessMs: typeof firstSuccessMs === 'number' ? firstSuccessMs : null,
                completionMs: typeof completionMs === 'number' ? completionMs : null
            })
        })

        room.state = ROUND_STATE_ANSWER
        room.roundStartAt = null

        return room
    }

    checkAnswer(roomId, playerId, answer, roomService) {
        const room = roomService.getRoom(roomId)
        if (room === undefined) {
            throw new Error('Salle introuvable');
        }

        const player = room.players.find(p => p.socketId === playerId)
        if (!player) {
            throw new Error('Joueur introuvable');
        }

        const currentMusic = room.currentMusic

        if (!currentMusic || (!currentMusic.title && !currentMusic.title_short)) {
            return { room, evaluation: null }
        }

        if (!room.roundStartAt) {
            room.roundStartAt = Date.now()
        }

        ensureRoundCollections(room)

        const evaluation = evaluateAnswerAgainstTrack(answer, currentMusic, {
            titleThreshold: FUZZY_MATCHING?.TITLE_SIMILARITY_THRESHOLD,
            artistThreshold: FUZZY_MATCHING?.ARTIST_SIMILARITY_THRESHOLD
        })

        const now = Date.now()
        const roundDuration = getRoundDuration(room)
        const elapsedMs = now - room.roundStartAt

        let titlePoints = 0
        let artistPoints = 0
        let bonusPoints = 0

        let newlyGuessedTitle = false
        let newlyGuessedArtist = false

        if (evaluation.titleMatch.matched && !player.titleGuessed) {
            titlePoints = computeComponentScore(
                elapsedMs,
                SCORING.MAX_POINTS_TITLE,
                roundDuration,
                SCORING.MIN_POINTS_PER_COMPONENT
            )
            player.titleGuessed = true
            newlyGuessedTitle = true
            player.totalScore += titlePoints
            player.currentRoundScore = (player.currentRoundScore || 0) + titlePoints
        }

        if (evaluation.artistMatch.matched && !player.artistGuessed) {
            artistPoints = computeComponentScore(
                elapsedMs,
                SCORING.MAX_POINTS_ARTIST,
                roundDuration,
                SCORING.MIN_POINTS_PER_COMPONENT
            )
            player.artistGuessed = true
            newlyGuessedArtist = true
            player.totalScore += artistPoints
            player.currentRoundScore = (player.currentRoundScore || 0) + artistPoints
        }

        if (newlyGuessedTitle && newlyGuessedArtist) {
            bonusPoints = SCORING.BONUS_BOTH_COMPONENTS
            player.totalScore += bonusPoints
            player.currentRoundScore = (player.currentRoundScore || 0) + bonusPoints
        }

        if ((newlyGuessedTitle || newlyGuessedArtist) && !player.firstCorrectAt) {
            player.firstCorrectAt = now
        }

        if (player.titleGuessed && player.artistGuessed && !player.completedAt) {
            player.completedAt = now
        }

        const shouldRecordProgress = player.titleGuessed || player.artistGuessed || titlePoints || artistPoints || bonusPoints
        const firstSuccessMs = player.firstCorrectAt && room.roundStartAt
            ? player.firstCorrectAt - room.roundStartAt
            : null

        const completionMs = player.completedAt && room.roundStartAt
            ? player.completedAt - room.roundStartAt
            : null

        if (shouldRecordProgress) {
            const resultEntry = getRoundResultForPlayer(room, player)

            if (titlePoints || artistPoints || bonusPoints) {
                resultEntry.awardedHistory.push({
                    timestamp: now,
                    elapsedMs,
                    titlePoints,
                    artistPoints,
                    bonusPoints
                })
            }

            resultEntry.titleMatched = player.titleGuessed
            resultEntry.artistMatched = player.artistGuessed
            resultEntry.roundScore = player.currentRoundScore || 0
            resultEntry.totalScore = player.totalScore
            resultEntry.firstSuccessMs = typeof firstSuccessMs === 'number'
                ? firstSuccessMs
                : resultEntry.firstSuccessMs
            resultEntry.completionMs = typeof completionMs === 'number'
                ? completionMs
                : resultEntry.completionMs
            resultEntry.lastElapsedMs = elapsedMs
        }

        return {
            room,
            evaluation: {
                playerId: player.socketId,
                titleMatch: evaluation.titleMatch,
                artistMatch: evaluation.artistMatch,
                newlyGuessed: {
                    title: newlyGuessedTitle,
                    artist: newlyGuessedArtist
                },
                points: {
                    title: titlePoints,
                    artist: artistPoints,
                    bonus: bonusPoints
                },
                roundScore: player.currentRoundScore || 0,
                totalScore: player.totalScore,
                elapsedMs,
                firstSuccessMs,
                completionMs,
                currentRoundResults: room.currentRoundResults
            }
        }
    }

    AllPlayerGuessed(room) {
        const allPlayersGuessed = room.players.every(p => p.titleGuessed && p.artistGuessed);
        return !!allPlayersGuessed;
    }
}

module.exports = new GameService();
