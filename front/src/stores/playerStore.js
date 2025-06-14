import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
    state: () => ({
        player : {
            host : false,
            roomId : null,
            username : "",
            socketId : "",
            titleGuessed : false,
            totalScore: 0,
            roundScore : 0,
            speed : 0,
        },
        socket : null,

        room: {
            id: null,
            players: [],
            setting: {
                category: null,
                songCount: null,
                difficulty: null,
            },
            musicsToGuess: [],
            gameStarted : false,
            round : {
                currentMusic : 0,
                roundEnded  : false,
                bestPlayers : []
            }
        }
    }),

    actions: {
        setPlayer(player) {
            this.player = player
            console.log('player', this.player)
        },
        setUsername(username) {
            this.player.username = username
        },
        setSocket(socket) {
            this.socket = socket
        },
        setRoom(room) {
            this.room = room
        },
        setArtistGuessed(artistGuessed) {
            this.artistGuessed = artistGuessed
        },
        setTitleGuessed(titleGuessed) {
            this.titleGuessed = titleGuessed
        },
    }
})