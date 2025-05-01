<script setup>
import MusicGuessing from "~/components/MusicGuessing.vue";
import {useMusicStore} from "~/stores/musics.js";


const musicStore = useMusicStore()

// Variables calculées depuis le store
const gameStarted = computed(() => musicStore.gameStarted)
const gamePaused = computed(() => musicStore.gamePaused)
const musicsToGuess = computed(() => musicStore.musicsToGuess)

const audioVolume = ref(0.05)
const difficulty = ref("facile"); // Niveau de difficulté par défaut

function updateVolume(event) {
    const audioElement = document.querySelector("audio");
    audioVolume.value = event.target.value;
    if (audioElement) {
        audioElement.volume = audioVolume.value;
    }
}

</script>

<template>
    <div class="blindtest-container u-flex u-flex-direction-column u-justify-content-center u-align-items-center">

        <MusicGuessing v-if="gameStarted"/>

        <div class="volume-control">
            <label for="volume-slider">Volume</label>
            <input id="volume-slider" type="range" min="0" max="1" step="0.01" v-model="audioVolume" @input="updateVolume"/>
        </div>
    </div>
</template>

<style scoped lang="scss">

.blindtest-container {
    width: 100vw;
    height: 100vh;

    p {
        border: 1px solid black;
        padding: 25px;
        width: 200px;
        text-align: center;
        text-decoration: none;
        color: black;
        cursor: pointer;
    }

    .difficulty {
        display: flex;
        width: 100%;

        div {
            cursor: pointer;
            padding: 10px;
            border-radius: 5px;
            background-color: #444;
            color: #fff;

            &:hover {
                background-color: #666;
            }
        }
    }




    .volume-control {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        align-items: center;
        gap: 10px;

        input[type="range"] {
            width: 150px;
        }
    }
}

</style>