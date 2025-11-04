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
            },

            state: "config", // config, guessing, answer, ended
            playlist : [], // ancienement MusicsToGuess
            round : -1,
            currentMusic : {},
            roundSummary : {}
        },
        username : "",
        roomList : [],
        volume : 0.7
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

        setRoom(room) {
            this.room = room
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
                },
                state: "config",
                playlist: [],
                round: -1,
                currentMusic: {},
                roundSummary: {}
            }
        },
    }
})