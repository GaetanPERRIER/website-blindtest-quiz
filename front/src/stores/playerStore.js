import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
    state: () => ({
        categories: [],
        room: {
            id: null,
            players: [],
            setting: {
                category: null,
                songCount: null,
                difficulty: null,
            },
            state: "config",
            playlist: [],
            round: -1,
            currentMusic: {},
            roundSummary: {}
        },
        username: "",
        roomList: [],
        volume: 0.7
    }),

    getters: {
        exponentialVolume: (state) => Math.pow(state.volume, 2.5)
    },

    actions: {
        setVolume(value) {
            this.volume = value
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

        setCategories(categories) {
            this.categories = categories
        },

        resetRoom() {
            this.room = {
                id: null,
                players: [],
                setting: {
                    category: null,
                    songCount: null,
                    difficulty: null,
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
