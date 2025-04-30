import { defineStore } from 'pinia'

export const useMusicStore = defineStore('music', {
    state: () => ({
        musicsToGuess : [],
        currentMusic : 0,
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
            this.resumeGame()
        },
    },
})
