<script setup>
import {usePlayerStore} from "~/stores/player.js";


defineProps({
    gameStatus: {
        type: Boolean,
        default: false
    }
})

const playerStore = usePlayerStore();

const bgGradient = computed(() => playerStore.bgGradient);
const room = computed(() => playerStore.room);
const currentPlayer = computed(() => playerStore.player);


onMounted(() => {
});

function EjectAPlayer(event) {
    const roomId = room.value.id;
    const socketId = event.target.dataset.socketId;

    socket.emit("eject player", roomId, socketId);
}



</script>

<template>
    <div :class="gameStatus ? 'player-list u-flex-direction-column' : 'player-list' ">
        <div v-for="(player, index) in room.players" :key="index" class="blindtest-player">
            <div class="player-avatar-container">
                <img class="player-avatar" src="/avatar.png" alt="">
                <img v-if="player.host" class="host" src="/icons/crown.png" alt="Hôte">
                <img v-if="currentPlayer.host && !player.host" class="cross-eject-player" src="/icons/cross.png" alt="Cross" :data-socket-id="player.socketId" @click="EjectAPlayer">
                <p class="player-username">{{ player.username }}</p>
            </div>
            <p v-if="gameStatus"> {{player.score}}</p>

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
        justify-content: space-between;
        align-items: center;
        gap: 50px;
        height: 100%;
        transform: scale(0.9);

        .player-avatar-container {
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 10px;
            width: 100px;

            .host {
                position: absolute;
                top: -0.462962962962963vh;
                right: -0.2604166666666667vw;
                width: 1.302083333333333vw;
                height: 1.302083333333333vw;
            }

            .cross-eject-player {
                position: absolute;
                top: 0;
                right: 0;
                width: 1.041666666666667vw;
                height: 1.041666666666667vw;
                cursor: pointer;
            }
        }


        .player-username {
            font-size: 18px;
            color: white;
            text-align: center;
            white-space: nowrap;
        }


    }


}



</style>