import { defineStore } from 'pinia'

export const usePlayerStore = defineStore('player', {
    state: () => ({
        room: {
            id: null,
            players: [],

            setting: {
                category: null,
                songCount: null,
                difficulty: null,
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
        
        setTitleGuessed(titleGuessed) {
            this.titleGuessed = titleGuessed
        },



        /* Events socket */
        SetRoomPlayers(players) {
            this.room.players = players
        },

        SetRoom(room) {
            this.room = room
        },

        SetRoomList(roomList) {
            this.roomList = roomList
        },

        SetCategory(newCategory) {
            this.room.setting.category = newCategory
        },

        SetSoungCount(newSongCount) {
            this.room.setting.songCount = newSongCount
        },

        SetDifficulty(newDifficulty) {
            this.room.setting.difficulty = newDifficulty
        },

        StartGame(room) {
            this.room = room
        },

        ResetRoom() {
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