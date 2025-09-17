<script setup>
import {usePlayerStore} from "@/stores/playerStore.js";
import ParticleBackground from "@/components/Basics/ParticleBackground.vue";
import Playing from "@/components/Blindtest/Game/Playing.vue";
import socket from "@/utils/socket.js";
import {computed, onMounted, ref} from "vue";
import GameConfig from "@/components/Blindtest/Room/GameConfig.vue";
import ScaleSpawnAnimation from "@/components/Basics/ScaleSpawnAnimation.vue";
import SlideSpawnAnimation from "@/components/Basics/SlideSpawnAnimation.vue"
import BeforeUnload from "@/components/Basics/BeforeUnload.vue";
import ModalRoundOver from "@/components/Blindtest/Game/ModalRoundOver.vue";
import Guessing from "@/components/Blindtest/Game/Guessing.vue";


/* Variables */
const playerStore = usePlayerStore()


const room = computed(() => playerStore.room);
const currentPlayer = computed(() =>
    playerStore.room.players.find(player => player.socketId === socket.id)
)

/* états de jeu depuis le store */
const gameState = computed(() => playerStore.room.state);



onMounted(() => {
    
    /* Events socket */

    socket.off("roomUpdated")
    socket.on('roomUpdated', (newRoom) => {
        playerStore.SetRoom(newRoom)
        console.log("[the room is updated] :", room.value)
    })

    socket.off("gameFinished")
    socket.on('gameFinished', (newRoom) => {
        playerStore.SetRoom(newRoom)
        console.log("[Game over] :", room.value)
    })
});

</script>

<template>
    <div>{{ gameState }}</div>
    <div v-if="gameState === 'config'" class="blindtest-container u-flex u-justify-content-center u-align-items-center u-p50 u-gap100">
        <ScaleSpawnAnimation :rotate="false">
            <GameConfig/>
        </ScaleSpawnAnimation>
    </div>

    <div v-if="gameState === 'guessing'" class="blindtest-container">
        <ScaleSpawnAnimation :rotate="false">
            <Guessing/>
        </ScaleSpawnAnimation>
    </div>

    <div v-if="gameState === 'answer'" class="blindtest-container">
        <SlideSpawnAnimation direction="bottom" transition-duration="1500ms">
            <div class="modal-anchor">
                <div class="modal-positioner">
                    <ModalRoundOver ref="modal" />
                </div>
            </div>
        </SlideSpawnAnimation>
    </div>


    <!--
    <div v-if="!room.gameStarted" class="blindtest-container u-flex u-justify-content-center u-align-items-center u-p50 u-gap100">
        <ScaleSpawnAnimation :rotate="false">
            <GameConfig v-if="gameConfigVisible"/>
        </ScaleSpawnAnimation>
    </div>

    <div v-else class="blindtest-container">
        <div class="musics-container">
            <Playing/>
        </div>
    </div>
    -->


    <ParticleBackground/>
    <BeforeUnload/>
</template>

<style scoped lang="scss">

.blindtest-container {
    width: 100vw;
    height: 100vh;
    position: relative;
    z-index: 1;

    h1 {
        font-size: 30px;
        color: #fff;
        text-align: center;
        margin-top: 20px;
        width: 100%;
        height: 35px;
        overflow: hidden;
    }

    .musics-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }

    input, button  {
        width: 450px;
        padding: 12px 15px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
        border-radius: 25px;
        outline: none;
        font-size: 16px;
        backdrop-filter: blur(5px);
        text-align: center;
    }

    button {
        width: 300px;
        cursor: pointer;
    }

    input {
        cursor: text;
    }

    &::placeholder {
        color: rgba(255, 255, 255, 0.7);
    }
}
</style>