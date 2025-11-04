const { DEFAULT_GAME_SETTINGS, GAME_RULES } = require('../config/constants');
const DeezerService = require('./deezer.service');

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
            player.totalScore = 0;
            player.isReady = false;
        });

        room.playlist = allTracks;
        room.round = -1;
        room.state = 'config';
        room.gameStarted = true;

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
            room.state = 'ended';
            return room;
        }

        room.currentMusic = room.playlist[room.round]
        room.state = "guessing"

        room.players.forEach(player => {
            player.titleGuessed = false;
        });

        return room
    }

    endRound(roomId, roomService) {
        const room = roomService.getRoom(roomId)

        room.state = "answer"

        return room
    }

    checkAnswer(roomId, playerId, answer, roomService) {
        const room = roomService.getRoom(roomId)
        if(room === undefined) {
            throw new Error('Salle introuvable');
        }

        const currentMusic = room.currentMusic;

        if (!currentMusic || !currentMusic.title) {
            return room;
        }

        if (typeof answer !== 'string') {
            return room;
        }

        const normalizedAnswer = answer.trim().toLowerCase();
        const isCorrect = normalizedAnswer === (currentMusic.title || '').toLowerCase();
        const player = room.players.find(p => p.socketId === playerId);

        if (isCorrect && !player.titleGuessed) {
            player.titleGuessed = true;
            player.totalScore += 100;
        }
        return room
    }

    AllPlayerGuessed(room) {
        const allPlayersGuessed = room.players.every(p => p.titleGuessed);
        return !!allPlayersGuessed;
    }
}

module.exports = new GameService();
