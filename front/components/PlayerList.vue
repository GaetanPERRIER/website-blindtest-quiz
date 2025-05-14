<script setup>
import {usePlayerStore} from "~/stores/player.js";

const playerStore = usePlayerStore();

const bgGradient = computed(() => playerStore.bgGradient);
const room = computed(() => playerStore.room);
const currentPlayer = computed(() => playerStore.player);


onMounted(() => {
    const playerContainer = document.querySelector(".players-container");
    if (playerContainer) {
        playerContainer.style.background = bgGradient.value;
        playerContainer.style.animation = "gradient 10s ease infinite";
        playerContainer.style.backgroundSize = "200% 200%";
    }

});

function EjectAPlayer(event) {
    const roomId = room.value.id;
    const socketId = event.target.dataset.socketId;

    socket.emit("eject player", roomId, socketId);
}



</script>

<template>
    <div class="player-list">
        <h1 class="title-blindtest">Players</h1>
        <div class="players-container u-gap10">
            <div v-for="(player, index) in room.players" :key="index" class="blindtest-player">
                <p>{{ player.username }}</p>
                <img v-if="player.host" class="host" src="/icons/crown.png" alt="Hôte">
                <img v-if="currentPlayer.host && !player.host" class="cross-eject-player" src="/icons/cross.png" alt="Cross" :data-socket-id="player.socketId" @click="EjectAPlayer"  >
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

.player-list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    h1 {
        font-size: 30px;
        color: #fff;
        text-align: center;
        margin-bottom: 15px;
        width: 100%;
        height: 35px;
        overflow: hidden;
    }

    .players-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 15px 15px;
        width: 400px;
        border-radius: 10px;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;

        .host {
            width: 25px;
            height: 25px;
        }

        .cross-eject-player {
            width: 20px;
            height: 20px;
            cursor: pointer;
        }

        .blindtest-player {
            width: 100%;
            height: 50px;
            display: flex;
            gap: 10px;
            justify-content: center;
            align-items: center;
            background-color: rgba(255, 255, 255, 0.25);
            border: rgba(255, 255, 255, 0.5) 1px solid;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    }

}

</style>