import { defineStore } from 'pinia'

export const useMusicStore = defineStore('music', {
    state: () => ({
        score: 0,
        startTime: null,
        maxPointsPerQuestion: 1000,

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

        resetGame() {
            this.gameStarted = false
            this.gamePaused = false
            this.gameFinished = false
            this.currentMusic = 0
            this.titleGuessed = false
            this.artistGuessed = false
        },

        finishGame() {
            this.gameFinished = true
            this.currentMusic = 0
            this.gamePaused = false
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
