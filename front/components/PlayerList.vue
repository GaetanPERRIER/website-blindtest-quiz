<script setup>
import {usePlayerStore} from "~/stores/player.js";

const playerStore = usePlayerStore();

const bgGradient = computed(() => playerStore.bgGradient);
const room = computed(() => playerStore.room);
const currentPlayer = computed(() => playerStore.player);

// Jeu de données de joueurs test
const playersTest = [
    { username: "Player 1", host: true, socketId: "123" },
    { username: "Caler le triso", host: false, socketId: "456" },
    { username: "Player 3", host: false, socketId: "789" },
    { username: "Player 4", host: false, socketId: "101" },
    { username: "Player 5", host: false, socketId: "112" },
    { username: "Player 6", host: false, socketId: "131" },
];


onMounted(() => {

});

function EjectAPlayer(event) {
    const roomId = room.value.id;
    const socketId = event.target.dataset.socketId;

    socket.emit("eject player", roomId, socketId);
}



</script>

<template>
    <div class="player-list">
        <div v-for="(player, index) in playersTest" :key="index" class="blindtest-player">
            <div class="player-avatar-container">
                <img class="player-avatar" src="/avatar.png" alt="">
                <img v-if="player.host" class="host" src="/icons/crown.png" alt="Hôte">
                <img v-if="currentPlayer.host && !player.host" class="cross-eject-player" src="/icons/cross.png" alt="Cross" :data-socket-id="player.socketId" @click="EjectAPlayer">
            </div>
            <p class="player-username">{{ player.username }}</p>

        </div>
    </div>
</template>

<style scoped lang="scss">


.player-list {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: space-evenly;
    align-items: center;

    .blindtest-player {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 5px;
        height: 100%;


        .player-avatar-container {
            width: 60px;
            height: 60px;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;

            .host {
                position: absolute;
                top: -5px;
                right: -5px;
                width: 25px;
                height: 25px;
            }

            .cross-eject-player {
                position: absolute;
                top: 0;
                right: 0;
                width: 20px;
                height: 20px;
                cursor: pointer;
            }

            .player-avatar {
                width: 100%;
            }
        }


        .player-username {
            font-size: 14px;
            width: 100%;
            color: white;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
        }


    }


}



</style>