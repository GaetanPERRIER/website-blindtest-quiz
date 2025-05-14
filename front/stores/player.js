import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
    state: () => ({
        player : {
            host : false,
            roomId : null,
            username : "",
            socketId : "",
        },
        socket : null,
        bgGradient : "",

        room : {
            id : null,
            players : [],
            category : null,
            musicsToGuess : [],
            currentMusic : 0,
            gameStarted : false,
        },

        artistGuessed : false,
        titleGuessed : false,

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
        setBgGradient(gradient) {
            this.bgGradient = gradient
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