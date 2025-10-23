const { DEFAULT_GAME_SETTINGS } = require('../config/constants');

class GameService {
    constructor() {
    }

    async startGame(roomId, roomService) {
        const room = roomService.getRoom(roomId)
        if(room === undefined) {
            throw new Error('Salle introuvable');
        }

        const urlTracklist = room.setting.category.tracklist
        const nbMusics = room.setting.songCount
        const difficulty = room.setting.difficulty

        const allTracks = await this.fetchTracks(urlTracklist, nbMusics, difficulty)
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
                if (!response.ok) throw new Error(`Erreur Deezer: ${response.statusText}`);
                const data = await response.json();
                allTracks = allTracks.concat(data.data);
                nextUrl = data.next;
            }
        } catch (error) {
            console.error('Erreur API Deezer:', error);
        }
        return this.chooseTracks(allTracks, count, difficulty)
    }

    chooseTracks(allTracks, songCount, difficulty) {
        console.log(songCount, difficulty)
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
        console.log("[Round terminé]")

        return room
    }

    checkAnswer(roomId, playerId, answer, roomService) {
        const room = roomService.getRoom(roomId)
        if(room === undefined) {
            throw new Error('Salle introuvable');
        }

        const currentMusic = room.currentMusic;

        const isCorrect = answer.toLowerCase() === currentMusic.title.toLowerCase();
        const player = room.players.find(p => p.socketId === playerId);

        if (isCorrect && !player.titleGuessed) {
            player.titleGuessed = true;
            player.totalScore += 100;
            console.log(`[Bonne réponse] : ${player.username} a trouvé le titre ${currentMusic.title}`);
        }
        return room
    }

    AllPlayerGuessed(room) {
        const allPlayersGuessed = room.players.every(p => p.titleGuessed);
        return !!allPlayersGuessed;
    }
}

module.exports = new GameService();
