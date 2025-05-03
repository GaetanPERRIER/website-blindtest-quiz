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
    }),

    actions: {
        setPlayer(player) {
            this.player = player
        },
        setUsername(username) {
            this.player.username = username
        },
        setSocket(socket) {
            this.socket = socket
        }
    }
})