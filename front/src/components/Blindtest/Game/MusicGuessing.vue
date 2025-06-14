<script setup>
import {usePlayerStore} from "@/stores/playerStore.js";
import {computed, ref, onMounted} from "vue";
import socket from "@/utils/socket.js";
import PlayerList from "@/components/Blindtest/Room/PlayerList.vue";
import ModalRoundOver from "@/components/Blindtest/Game/ModalRoundOver.vue";

const playerStore = usePlayerStore();

const currentPlayer = computed(() => playerStore.player);
const room = computed(() => playerStore.room);
const musicToGuess = computed(() => room.value.musicsToGuess[room.value.round.currentMusic]);

const audioVolume = ref(0.01);
let userAnswer = ref("");

onMounted(() => {

})

function CheckAnswer() {
    socket.emit("checkAnswer", room.value.id, currentPlayer.value.socketId, userAnswer.value);
    userAnswer.value = "";
}

function SongEnded() {
    socket.emit("songEnded", room.value.id, currentPlayer.value.socketId);
    // Recommencer la musique ?
}


</script>

<template>
    <div class="game">
        <div class="game-container u-flex u-flex-direction-column u-justify-content-center u-align-items-center w100 h100 u-gap20">

            <div class="player-list-container">
                <PlayerList :playing="true"/>
            </div>

            <div class="musicToDisplay">
                <img v-if="room.round.roundEnded || currentPlayer.titleGuessed" :src="musicToGuess.album.cover_xl" alt="" class="album-cover">
                <audio :src="musicToGuess.preview" controls autoplay :volume="audioVolume/2" @ended="SongEnded"></audio>
            </div>

            <div v-if="!room.round.roundEnded && !currentPlayer.titleGuessed" class="input-container u-flex u-flex-direction-column u-gap10">
                <div class="u-flex u-gap10">
                    <input class="t-color-white t-body-text" v-model="userAnswer" type="text" placeholder="Saisir le nom de la musique..." @keydown.enter="CheckAnswer">
                    <button class="t-body-text t-color-white" @click="CheckAnswer">Valider</button>
                </div>
                <div class="loading-bar"></div>
            </div>

            <div v-if="room.round.roundEnded || currentPlayer.titleGuessed" class="music-info">
                <h2 class="t-color-white t-body-text">{{ musicToGuess.title_short }}</h2>
                <p class="t-color-white t-body-text">par {{ musicToGuess.artist.name }}</p>
            </div>


            <div v-if="room.round.roundEnded">
                <ModalRoundOver/>
            </div>


        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

#vue-tracer-overlay {
    display: none !important;
}

.game {
    width: 100%;
    height: 100%;
    z-index: 2;

    .game-container {
        position: relative;

        .player-list-container {
            position: absolute;
            right: 50%;
            transform: translate(50%);
            bottom: 20px;
        }

        .input-container {
            input {
                padding: 10px 25px;
                background-color: rgba(255, 255, 255, 0.1);
                border: 1px solid  rgba(255, 255, 255, 0.2);
                transition: all 200ms $authenticMotion;
                border-radius: 10px;

                &:focus {
                    outline: none;
                    border: 1px solid  rgba(255, 255, 255, 0.5);
                }
            }

            button {
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

            .loading-bar {
                position: relative;
                width: 100%;
                height: 8px;
                background-color: rgba(255, 255, 255, 0.1);
                border-radius: 15px;

                &::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 8px;
                    width: var(--progress-width, 0%);
                    background-color: rgba(255, 255, 255, 0.9);
                    border-radius: 15px;
                    transition: width 0.1s linear; /* Smooth animation */
                }
            }
        }

        .musicToDisplay {
            .album-cover {
                width: 300px;
                border-radius: 15px;
            }
        }

        .music-info {
            display: flex;
            gap: 5px;
        }
    }


    audio {
        display: none;
    }
}
</style>