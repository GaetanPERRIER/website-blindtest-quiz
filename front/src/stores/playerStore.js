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
            musicsToGuess: [],
            gameStarted : false,
            round : {
                currentMusic : 0,
                roundEnded  : false,
                bestPlayers : []
            }
        },
        username : ""

    }),

    actions: {

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
    }
})