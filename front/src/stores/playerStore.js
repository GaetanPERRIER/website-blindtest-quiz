import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
    state: () => ({
        room: {
            id: null,
            players: [],

            setting: {
                category: null,
                songCount: 10,
                difficulty: 'easy',
                roundDurationMs: 30000,
            },

            state: "config", // config, guessing, answer, ended
            playlist : [], // ancienement MusicsToGuess
            round : -1,
            currentMusic : {},
            roundSummary : null,
            currentRoundResults: [],
            roundHistory: [],
            roundStartAt: null
        },
        username : "",
        roomList : [],
        volume : 0.7,
        lastEvaluation: null
    }),

    getters: {
        exponentialVolume: (state) => Math.pow(state.volume, 2.5)
    },

    actions: {
        setVolume(value) {
            this.volume = value
        },

        /* Events socket */
        setRoomPlayers(players) {
            this.room.players = players
        },

        setCurrentRoundResults(results = []) {
            this.room.currentRoundResults = Array.isArray(results) ? results : []
        },

        setRoundSummary(summary) {
            this.room.roundSummary = summary || null
        },

        setLastEvaluation(evaluation) {
            this.lastEvaluation = evaluation
        },

        setRoom(room) {
            this.room = room
            if (!this.room.currentRoundResults) {
                this.room.currentRoundResults = []
            }
            if (!this.room.roundHistory) {
                this.room.roundHistory = []
            }
        },

        setRoomList(roomList) {
            this.roomList = roomList
        },

        setCategory(newCategory) {
            this.room.setting.category = newCategory
        },

        setSongCount(newSongCount) {
            this.room.setting.songCount = newSongCount
        },

        setDifficulty(newDifficulty) {
            this.room.setting.difficulty = newDifficulty
        },

        startGame(room) {
            this.room = room
        },

        resetRoom() {
            this.room = {
                id: null,
                players: [],
                setting: {
                    category: null,
                    songCount: 10,
                    difficulty: 'easy',
                    roundDurationMs: 30000
                },
                state: "config",
                playlist: [],
                round: -1,
                currentMusic: {},
                roundSummary: null,
                currentRoundResults: [],
                roundHistory: [],
                roundStartAt: null
            }
            this.lastEvaluation = null
        },
    }
})