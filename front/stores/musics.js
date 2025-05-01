import { defineStore } from 'pinia'

export const useMusicStore = defineStore('music', {
    state: () => ({
        blindtestCategories: [],
        musicsToGuess : [],
        currentMusic : 0,
        titleGuessed : false,
        artistGuessed : false,

        gameStarted: false,
        gamePaused: false,
        gameFinished: false,
    }),
    actions: {
        addMusics(newMusics) {
            this.musicsToGuess = newMusics
        },
        clearMusics() {
            this.musicsToGuess = []
        },

        startGame() {
            this.gameStarted = true
        },

        finishGame() {
            this.gameFinished = true
        },

        pauseGame() {
            this.gamePaused = true
        },

        resumeGame() {
            this.gamePaused = false
        },

        nextMusic() {
            this.currentMusic++
            this.setTitleGuessed(false)
            this.setArtistGuessed(false)
            this.resumeGame()
        },

        setBlindtestCategories(categories) {
            this.blindtestCategories = categories
        },

        setTitleGuessed(value) {
            this.titleGuessed = value
        },

        setArtistGuessed(value) {
            this.artistGuessed = value
        },
    },
})
