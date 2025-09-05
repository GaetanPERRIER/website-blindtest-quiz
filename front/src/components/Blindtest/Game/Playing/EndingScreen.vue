<script setup>
import {usePlayerStore} from "@/stores/playerStore.js";
import {computed, ref, onMounted} from "vue";
import PlayerList from "@/components/Blindtest/Room/PlayerList.vue";
import socket from "@/utils/socket";

const playerStore = usePlayerStore()

// Variables computed depuis le store
const room = computed(() => playerStore.room)
const playersReadyCount = computed(() => {
    return playerStore.room.players.filter(player => player.isReady === true).length
})


// Functions
const PlayerReady = () => {
    console.log("[Method player ready] : roomId : " + room.value.id, socket.id)
    socket.emit('playerReady', (room.value.id, socket.id))
}


</script>


<template>
    <div class="ending-screen-container">
        <h2 class="t-title t-color-white">Partie terminée !</h2>
        <div class="player-list-anchor-container">
            <PlayerList :game-ended="true"/>
        </div>
        <router-link to="/" class="cta-home t-body-text t-color-white">Retourner à l'accueil</router-link>
        <div>
            <button @click="PlayerReady()" class="t-body-text t-color-white"></button>
            <p class="players-ready-status">{{ playersReadyCount }}</p>
        </div>
    </div>
</template>


<style lang="scss" scoped>

.ending-screen-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;

    .player-list-anchor-container {
        width: 50%;
    }

    .cta-home, button {
        padding: 10px 25px;
        background-color: $major-yellow-color;
        border-radius: 10px;
        transition: all 200ms $authenticMotion;
        cursor: pointer;

        &:hover {
            background-color: darken($major-yellow-color, 10%);
            transform: scale(1.1);
        }
    }
}

</style>