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

async function GetAllMusics() {
    let musics = [];
    let musicsToGuess;
    let hasNext = true;
    const proxy = `/api/deezer`
    let url = "https://api.deezer.com/search?q=Linkin Park"

    while (hasNext) {
        const { data, error } = await useFetch(proxy, {
            query : {q: url}
        })

        if (error.value) {
            console.error('Erreur:', error.value)
        } else {
            musics.push(...data.value.data)
        }

        data.value.next ? url = data.value.next : hasNext = false
    }

    musicsToGuess = SelectRandomMusics(musics)
    musicStore.addMusics(musicsToGuess)
    musicStore.startGame()
}

function SelectRandomMusics(musics, nbMusics = 5) {
    const filteredMusics = musics.filter((music) => {
        if (difficulty.value === "facile") {
            return music.rank > 800000; // Musiques populaires
        } else if (difficulty.value === "moyen") {
            return music.rank > 500000 && music.rank <= 800000; // Musiques moyennement populaires
        } else if (difficulty.value === "difficile") {
            return music.rank <= 500000; // Musiques moins connues
        }
    });

    const randomMusics = [];
    const usedIndexes = new Set();

    while (randomMusics.length < nbMusics && filteredMusics.length > randomMusics.length) {
        const randomIndex = Math.floor(Math.random() * filteredMusics.length);
        if (!usedIndexes.has(randomIndex)) {
            randomMusics.push(filteredMusics[randomIndex]);
            usedIndexes.add(randomIndex);
        }
    }
    return randomMusics;
}


</script>

<template>
    <div class="blindtest-container u-flex u-flex-direction-column u-justify-content-center u-align-items-center">
        <div v-if="!gameStarted">
            <h2 class="u-mb5">Blindtest Linkin Park</h2>
            <div class="u-flex difficulty">
                <div @click="difficulty = 'facile'">Facile</div>
                <div @click="difficulty = 'moyen'">Moyen</div>
                <div @click="difficulty = 'difficile'">Difficile</div>
            </div>
            <p @click="GetAllMusics">Jouer</p>
        </div>

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