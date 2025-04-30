<script setup>

const musicStore = useMusicStore();

const gamePaused = computed(() => musicStore.gamePaused);
const gameFinished = computed(() => musicStore.gameFinished)
const musicsToGuess = computed(() => musicStore.musicsToGuess)
const currentMusic = computed(() => musicStore.currentMusic);

const audioVolume = ref(0.01);
let userAnswer = ref("");

function checkAnswer() {
    if (userAnswer.value.trim().toLowerCase() === musicsToGuess.value[currentMusic.value].title_short.toLowerCase()) {
        userAnswer.value = "";

        if (currentMusic.value + 1 < musicsToGuess.value.length) {
            musicStore.pauseGame();
        } else {
            musicStore.pauseGame();
        }
        console.log("Correct!");

    } else {
        console.log("Incorrect! Essayez encore.");
    }
}


</script>

<template>
    <div class="game">
        <div v-if="!gameFinished" class="u-flex u-flex-direction-column u-justify-content-center u-align-items-center">
            <div class="musicToDiplay">
                <img v-if="gamePaused" :src="musicsToGuess[currentMusic].album.cover" alt="Album Cover" class="u-mb5">
                <audio :src="musicsToGuess[currentMusic].preview" controls autoplay :volume="audioVolume" @ended="musicStore.pauseGame()"></audio>
            </div>
            <input v-if="!gamePaused" v-model="userAnswer" type="text" placeholder="Entrez le nom de la musique" @keydown.enter="checkAnswer">
            <p v-if="gamePaused"> {{musicsToGuess[currentMusic].artist.name}} - {{musicsToGuess[currentMusic].title_short }}</p>
            <button v-if="gamePaused && currentMusic + 1 !== musicsToGuess.length" @click="musicStore.nextMusic()">Musique suivante</button>
            <button v-if="gamePaused && currentMusic + 1 === musicsToGuess.length" @click="musicStore.finishGame()">Scores</button>
        </div>

        <div v-if="gameFinished" class="u-flex u-flex-direction-column u-justify-content-center u-align-items-center">
            <h2 class="u-mb5">Bravo !</h2>
            <p>Vous avez terminé le jeu !</p>
            <a href="/">Accueil</a>
        </div>
    </div>
</template>

<style scoped lang="scss">

.game {
    width: 100%;
    height: 100%;
    background-color: #000;
    color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    input {
        width: 250px;
        padding: 15px;
        border: 1px solid #fff;
        background-color: transparent;
        color: #fff;
        border-radius: 5px;
        outline: none;
    }

    .user-answer {
        color: #fff;
    }

    button, a{
        padding: 10px 20px;
        border: none;
        background-color: #444;
        color: #fff;
        cursor: pointer;
        border-radius: 5px;
        margin-top: 20px;

        &:hover {
            background-color: #666;
        }
    }

    p {
        color: #fff;
    }

    audio {
        display: none;
    }
}
</style>