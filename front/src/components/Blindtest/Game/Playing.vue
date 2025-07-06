<script setup>
import {usePlayerStore} from "@/stores/playerStore.js";
import {computed, ref, onMounted} from "vue";
import socket from "@/utils/socket.js";
import PlayerList from "@/components/Blindtest/Room/PlayerList.vue";
import ModalRoundOver from "@/components/Blindtest/Game/ModalRoundOver.vue";
import LinearLoadingBar from "@/components/Blindtest/Game/LinearLoadingBar.vue";
import ScaleSpawnAnimation from "@/components/Basics/ScaleSpawnAnimation.vue";
import InputAnswer from "@/components/Blindtest/Game/MusicGuessing/InputAnswer.vue";
import SlideSpawnAnimation from "@/components/Basics/SlideSpawnAnimation.vue";

/* Variables */
const playerStore = usePlayerStore();
const currentPlayer = computed(() =>
    playerStore.room.players.find(player => player.socketId === socket.id)
)
const room = computed(() => playerStore.room);
const musicToGuess = computed(() => room.value.musicsToGuess[room.value.round.currentMusic]);
const audioVolume = ref(0.01);

/* Handle Spawn Animation & element display */
const inputAnswerVisible = ref(false)
const playerListVisible = ref(false)
const answerVisible = ref(false)
const modalVisible = ref(false)
const endingScreenVisible = ref(false)

/* Functions */

function SongEnded() {
    socket.emit("songEnded", room.value.id, currentPlayer.value.socketId);
    // Recommencer la musique ?
}

onMounted(() => {

    // Handle the start of a round
    socket.off('roundStarted');
    socket.on('roundStarted', (room) => {
        playerStore.SetRoom(room)
        modalVisible.value = false
        inputAnswerVisible.value = true
        playerListVisible.value = true
        console.log("[Round started]", room)
    })

    // Handle the music to guess
    socket.on('titleGuessed', (players) => {
        playerStore.SetRoomPlayers(players)
    })

    // Handle the end of a round
    socket.off('roundEnded');
    socket.on('roundEnded',(room) => {
        playerStore.SetRoom(room)
        inputAnswerVisible.value = false
        playerListVisible.value = false
        modalVisible.value = true
        answerVisible.value = false
        console.log("[Round ended]", room)

        setTimeout(() => {
            socket.emit("nextMusic", room.id, currentPlayer.value.socketId);
        },5500)
    })

    // Handle the end of the game
    socket.off('gameEnded');
    socket.on('gameEnded', (room) => {
        inputAnswerVisible.value = false
        playerListVisible.value = false
        modalVisible.value = false
        answerVisible.value = false
        endingScreenVisible.value = true
        console.log("[Game ended]", room)
        playerStore.SetRoom(room)
    })
})

</script>

<template>
    <div class="game">
        <div class="game-container u-flex u-flex-direction-column u-justify-content-center u-align-items-center w100 h100 u-gap20">

            <ScaleSpawnAnimation :rotate="false">
                <div class="player-list-anchor" v-if="playerListVisible">
                    <div class="player-list-content">
                        <PlayerList :playing="true" />
                    </div>
                </div>
            </ScaleSpawnAnimation>


            <div class="musicToDisplay">
                <audio v-if="inputAnswerVisible" :src="musicToGuess.preview" controls autoplay :volume="audioVolume/2" @ended="SongEnded"></audio>
            </div>

            <ScaleSpawnAnimation :rotate="false">
                <InputAnswer v-if="inputAnswerVisible"/>
            </ScaleSpawnAnimation>

            <!--
                <div class="music-info-container" v-if="answerVisible">
                    <img :src="musicToGuess.album.cover_xl" alt="" class="album-cover">
                    <div class="music-info">
                        <h2 class="t-color-white t-body-text">{{ musicToGuess.title_short }}</h2>
                        <p class="t-color-white t-body-text">par {{ musicToGuess.artist.name }}</p>
                    </div>
                </div>
                -->
            
            <SlideSpawnAnimation direction="bottom" transition-duration="1500ms">
                <div class="modal-anchor" v-if="modalVisible">
                    <div class="modal-positioner">
                        <ModalRoundOver ref="modal" />
                    </div>
                </div>
            </SlideSpawnAnimation>

            <ScaleSpawnAnimation>
                <div class="ending-screen-container" v-if="endingScreenVisible">
                    <div class="ending-screen">
                        <h1 class="t-color-white t-title">La partie est terminée !</h1>
                        <h2 class="t-color-white t-subtitle">Merci d'avoir joué !</h2>
                        <div class="u-flex u-gap20">
                            <button class="">Rejouer</button>
                            <router-link class="" to="/">Accueil</router-link>
                        </div>
                    </div>

                </div>
            </ScaleSpawnAnimation>



        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

#vue-tracer-overlay {
    display: none !important;
}

.black-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    transition: opacity 200ms ease-in;
    background-color: rgba(0, 0, 0, 0.5);
}

.ending-screen-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;

    .ending-screen {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: 20px;

        h1 {
            color: white;
            font-size: 2rem;
            text-align: center;
        }

        button {
            padding: 10px 20px;
            background-color: $major-yellow-color;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 200ms ease-in;

            &:hover {
                background-color: darken($major-yellow-color, 10%);
            }
        }
    }
}

.game {
    width: 100%;
    height: 100%;
    z-index: 2;

    .modal-anchor {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .game-container {
        position: relative;

        .player-list-container {
            width: auto;
            z-index: 10;
        }

        .player-list-anchor {
            position: fixed;
            left: 0;
            right: 0;
            bottom: 20px;
            display: flex;
            justify-content: center;
        }

        .player-list-content {
            transform-origin: center;
        }

        .music-info-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 20px;

            .music-info {
                display: flex;
                flex-direction: column;
                gap: 5px;
                justify-content: center;
                align-items: center;
            }

            .album-cover {
                width: 300px;
                border-radius: 15px;
            }
        }
    }


    audio {
        display: none;
    }
}
</style>