const MusicService = require('./music.service');

class GameService {
    constructor() {
    }

    async startGame(roomId, roomService) {
        const room = roomService.getRoom(roomId)
        if (!room) return null;

        const category = room.setting.category;
        const nbMusics = room.setting.songCount;

        const playlistDetails = await MusicService.GetPlaylistDetails(category.id);

        // Shuffle and take required number
        let allTracks = (playlistDetails.songs || []).sort(() => Math.random() - 0.5).slice(0, nbMusics);

        room.players.forEach(player => {
            player.titleGuessed = false;
            player.totalScore = 0;
        })

        room.playlist = allTracks
        room.round = -1

        return room;
    }

    async fetchTracks(urlTracklist, count, difficulty) {
        let allTracks = []
        try {
            let nextUrl = urlTracklist

            while (nextUrl) {
                const response = await fetch(nextUrl)
                if (!response.ok) throw new Error(`Deezer API error: ${response.statusText}`);
                const data = await response.json();
                allTracks = allTracks.concat(data.data);
                nextUrl = data.next;
            }
        } catch (error) {
            console.error('Deezer API error:', error);
        }
        return this.chooseTracks(allTracks, count, difficulty)
    }

    chooseTracks(allTracks, songCount, difficulty) {
        let filteredTracks;
        switch (difficulty) {
            case 'easy':
                filteredTracks = allTracks.filter(track => track.rank >= 700000);
                break;
            case 'medium':
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
        if (!room) return null;

        room.round++
        room.currentMusic = room.playlist[room.round]
        room.state = "guessing"

        room.players.forEach(player => {
            player.titleGuessed = false;
        });

        return room
    }

    endRound(roomId, roomService) {
        const room = roomService.getRoom(roomId)
        if (room) {
            room.state = "answer"
        }
        return room
    }

    checkAnswer(roomId, playerId, answer, roomService) {
        const room = roomService.getRoom(roomId)
        if (!room) return null;

        const currentMusic = room.currentMusic;

        // Simple fuzzy match: remove accents, special characters, and compare lowercase
        const normalize = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
        
        const normalizedAnswer = normalize(answer);
        const normalizedTitle = normalize(currentMusic.title);
        
        // Remove text in parentheses (often contains "feat", "remaster", etc) from title for easier matching
        const cleanTitle = normalize(currentMusic.title.split('(')[0]);

        const isCorrect = normalizedAnswer === normalizedTitle || normalizedAnswer === cleanTitle;
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
