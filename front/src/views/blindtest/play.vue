<script setup>
import {usePlayerStore} from "@/stores/playerStore.js";
import ParticleBackground from "@/components/Basics/ParticleBackground.vue";
import socket from "@/utils/socket.js";
import {computed, onMounted, onBeforeUnmount, ref} from "vue";
import GameConfig from "@/components/Blindtest/Room/GameConfig.vue";
import ScaleSpawnAnimation from "@/components/Basics/ScaleSpawnAnimation.vue";
import SlideSpawnAnimation from "@/components/Basics/SlideSpawnAnimation.vue"
import BeforeUnload from "@/components/Basics/BeforeUnload.vue";
import ModalRoundOver from "@/components/Blindtest/Game/ModalRoundOver.vue";
import Guessing from "@/components/Blindtest/Game/Guessing.vue";
import EndingScreen from "@/components/Blindtest/Game/Playing/EndingScreen.vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";


/* Variables */
const playerStore = usePlayerStore()
const router = useRouter()

const room = computed(() => playerStore.room);
const currentPlayer = computed(() =>
    playerStore.room.players.find(player => player.socketId === socket.id)
)

/* états de jeu depuis le store */
const gameState = computed(() => playerStore.room.state);

/* handle spawn animations */
const handleGuessingAnimation = computed(() => {
  return playerStore.room.state === "guessing";
})



/* Functions */
const leaveRoom = () => {
    if (room.value.id && currentPlayer.value) {
        console.log("[Leaving room]:", room.value.id)
        
        // Nettoyer les listeners pour éviter les fuites mémoire
        socket.off("roomUpdated")
        socket.off("gameFinished")
        socket.off("roundEnded")
        
        // Émettre un événement pour notifier le serveur
        socket.emit('leaveRoom', room.value.id)
        
        // Réinitialiser le store localement
        playerStore.resetRoom()
    }
}

onMounted(() => {
    
    /* Events socket */

    socket.off("roomUpdated")
    socket.on('roomUpdated', (newRoom) => {
        playerStore.setRoom(newRoom)
        console.log("[the room is updated] :", room.value)
    })

    socket.off("gameFinished")
    socket.on('gameFinished', (newRoom) => {
        playerStore.setRoom(newRoom)
        console.log("[Game over] :", room.value)
    })

    socket.off("roundEnded")
    socket.on('roundEnded', (newRoom) => {
        playerStore.setRoom(newRoom)
        console.log("[Round ended] :", room.value)
    })

    socket.off('room:error')
    socket.off('game:error')
    socket.on('room:error', (message) => {
        console.error('[Room error]', message)
    })
    socket.on('game:error', (message) => {
        console.error('[Game error]', message)
    })
});

onBeforeUnmount(() => {
    // Quitter la room quand le composant est démonté (navigation vers une autre page)
    leaveRoom()
});

// Garde de navigation pour intercepter les changements de route
onBeforeRouteLeave((to, from) => {
    if (room.value.id && currentPlayer.value) {
        const confirmation = window.confirm(
            "Vous êtes sur le point de quitter la partie. Êtes-vous sûr de vouloir continuer ?"
        );

        if (confirmation) {
            leaveRoom();
            return true; // L'utilisateur a confirmé, on peut quitter la page
        } else {
            return false; // L'utilisateur a annulé, on reste sur la page
        }
    }
    return true; // Pas dans une room, on peut quitter sans confirmation
});
</script>

<template>
    <div v-if="gameState === 'config'" class="blindtest-container u-flex u-justify-content-center u-align-items-center u-p50 u-gap100">
        <ScaleSpawnAnimation :rotate="false">
            <GameConfig/>
        </ScaleSpawnAnimation>
    </div>

    <div v-if="gameState === 'guessing'" class="blindtest-container">
        <ScaleSpawnAnimation :rotate="false">
            <Guessing />
        </ScaleSpawnAnimation>
    </div>

    <div v-if="gameState === 'answer'" class="blindtest-container">
        <SlideSpawnAnimation direction="bottom" transition-duration="1500ms">
            <div class="modal-anchor" v-if="gameState === 'answer'">
                <div class="modal-positioner">
                    <ModalRoundOver ref="modal" />
                </div>
            </div>
        </SlideSpawnAnimation>
    </div>

    <div v-if="gameState === 'ended'" class="blindtest-container">
        <ScaleSpawnAnimation :rotate="false">
            <EndingScreen/>
        </ScaleSpawnAnimation>
    </div>

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