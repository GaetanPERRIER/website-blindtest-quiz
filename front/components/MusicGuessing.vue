<script setup>
const musicStore = useMusicStore();

const gamePaused = computed(() => musicStore.gamePaused);
const gameFinished = computed(() => musicStore.gameFinished)
const musicsToGuess = computed(() => musicStore.musicsToGuess)
const currentMusic = computed(() => musicStore.currentMusic);

const audioVolume = ref(0.01);

let userAnswer = ref("");
const titleGuessed = computed(() => musicStore.titleGuessed);
const artistGuessed = computed(() => musicStore.artistGuessed);

function checkAnswer() {
    // Check title
    if (userAnswer.value.trim().toLowerCase() === musicsToGuess.value[currentMusic.value].title_short.toLowerCase()) {
        musicStore.setTitleGuessed(true);
    }

    // Check artist
    if (userAnswer.value.trim().toLowerCase() === musicsToGuess.value[currentMusic.value].artist.name.toLowerCase()) {
        musicStore.setArtistGuessed(true);
    }

    // Check if both title and artist are guessed
    if (titleGuessed.value && artistGuessed.value) {
        musicStore.pauseGame()
    }
    userAnswer.value = "";
}
</script>

<template>
    <div class="game">
        <div v-if="!gameFinished" class="u-flex u-flex-direction-column u-justify-content-center u-align-items-center">
            <div class="musicToDisplay">
                <img v-if="gamePaused" :src="musicsToGuess[currentMusic].album.cover_xl" alt="Album Cover"
                     class="album-cover">
                <audio :src="musicsToGuess[currentMusic].preview" controls autoplay :volume="audioVolume/2"
                       @ended="musicStore.pauseGame()"></audio>
            </div>

            <SoundVisualizer/>

            <div class="input-container" v-if="!gamePaused">
                <input v-model="userAnswer" type="text" placeholder="Entrez le nom de la musique ou l'artiste"
                       @keydown.enter="checkAnswer">
                <button @click="checkAnswer">Valider</button>
            </div>

            <div class="music-info" v-if="gamePaused">
                <h2>{{ musicsToGuess[currentMusic].title_short }}</h2>
                <p>par {{ musicsToGuess[currentMusic].artist.name }}</p>
            </div>

            <div class="feedback">
                <p v-if="titleGuessed" class="success">Titre trouvé !</p>
                <p v-if="artistGuessed" class="success">Artiste trouvé !</p>
            </div>

            <div class="actions">
                <button v-if="gamePaused && currentMusic + 1 !== musicsToGuess.length" @click="musicStore.nextMusic()">
                    Musique suivante
                </button>
                <button v-if="gamePaused && currentMusic + 1 === musicsToGuess.length" @click="musicStore.finishGame()">
                    Voir les scores
                </button>
            </div>
        </div>

        <div v-if="gameFinished" class="game-finished">
            <h2>Bravo !</h2>
            <p>Vous avez terminé le jeu !</p>
            <div class="links" @click="musicStore.resetGame()">
                <router-link to="/">Accueil</router-link>
                <router-link to="/front/pages/blindtest/brouillon">Rejouer</router-link>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.game {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
    text-align: center;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    z-index: 2;

    .musicToDisplay {
        margin-bottom: 30px;

        .album-cover {
            width: 250px;
            height: 250px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            margin-bottom: 20px;
            border: 3px solid rgba(255, 255, 255, 0.1);
        }
    }

    .input-container {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;

        input {
            width: 300px;
            padding: 12px 15px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            background-color: rgba(255, 255, 255, 0.1);
            color: white;
            border-radius: 25px;
            outline: none;
            font-size: 16px;
            backdrop-filter: blur(5px);

            &::placeholder {
                color: rgba(255, 255, 255, 0.7);
            }
        }

        button {
            padding: 12px 25px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s ease;

            &:hover {
                background: rgba(255, 255, 255, 0.3);
            }
        }
    }

    .music-info {
        margin-bottom: 20px;

        h2 {
            font-size: 28px;
            margin-bottom: 5px;
        }

        p {
            font-size: 18px;
            opacity: 0.8;
        }
    }

    .feedback {
        min-height: 50px;

        .success {
            color: #4caf50;
            font-weight: bold;
        }
    }

    .actions {
        margin-top: 20px;

        button {
            padding: 12px 25px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
            margin: 0 10px;

            &:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-2px);
            }
        }
    }

    .game-finished {
        h2 {
            font-size: 32px;
            margin-bottom: 15px;
        }

        p {
            font-size: 18px;
            margin-bottom: 30px;
        }

        .links {
            display: flex;
            gap: 15px;

            a {
                padding: 12px 25px;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border-radius: 25px;
                text-decoration: none;
                transition: all 0.3s ease;

                &:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateY(-2px);
                }
            }
        }
    }

    audio {
        display: none;
    }
}
</style>