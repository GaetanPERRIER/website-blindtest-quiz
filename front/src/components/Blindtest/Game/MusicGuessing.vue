<script setup>
import {usePlayerStore} from "@/stores/playerStore.js";
import {computed, ref} from "vue";
import socket from "@/utils/socket.js";
import PlayerList from "@/components/Blindtest/Room/PlayerList.vue";

const playerStore = usePlayerStore();

const currentPlayer = computed(() => playerStore.player);
const room = computed(() => playerStore.room);
const musicToGuess = computed(() => room.value.musicsToGuess[room.value.currentMusic]);

const audioVolume = ref(0.01);

let userAnswer = ref("");

function CheckAnswer() {
    socket.emit("check answer", room.value.id, currentPlayer.value.socketId, userAnswer.value);
    userAnswer.value = "";
}

function SongEnded() {
    socket.emit("song ended", room.value.id, currentPlayer.value.socketId);
}

function nextMusic() {
    if (currentPlayer.value.host) {
        socket.emit("next music", room.value.id);
    }
}

</script>

<template>
    <div class="game">
        <div class="game-container u-flex u-flex-direction-column u-justify-content-center u-align-items-center">

            <div class="game-status u-flex u-flex-direction-column">
                <h2>{{ room.category.title }} - {{ room.currentMusic + 1 }} / {{ room.musicsToGuess.length}}</h2>
                <div class="players-status">
                    <PlayerList :game-status="true"/>
                </div>
            </div>

            <div class="musicToDisplay">
                <img v-if="room.roundEnded || currentPlayer.titleGuessed" :src="musicToGuess.album.cover_xl" alt="" class="album-cover">
                <audio :src="musicToGuess.preview" controls autoplay :volume="audioVolume/2" @ended="SongEnded"></audio>
            </div>

            <div v-if="!room.roundEnded && !currentPlayer.titleGuessed" class="input-container">
                <input v-model="userAnswer" type="text" placeholder="Entrez le nom de la musique" @keydown.enter="CheckAnswer">
                <button @click="CheckAnswer">Valider</button>
            </div>

            <div v-if="room.roundEnded || currentPlayer.titleGuessed" class="music-info">
                <h2>{{ musicToGuess.title_short }}</h2>
                <p>par {{ musicToGuess.artist.name }}</p>
            </div>

            <div class="actions">
                <button v-if="currentPlayer.host && room.roundEnded" @click="nextMusic">Musique suivante</button>
            </div>


            <!--
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
        -->
        </div>
    </div>
</template>

<style scoped lang="scss">

#vue-tracer-overlay {
    display: none !important;
}

.game {
    width: 100%;
    height: 100%;
    z-index: 2;

    .game-container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 2.604166666666667vw;
        text-align: center;
        color: white;
    }

    .game-status {
        position: absolute;
        max-width: 450px;
        top: 50%;
        left: 100px;
        transform: translateY(-50%);
        gap: 25px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        padding: 50px 25px;
        backdrop-filter: blur(0.390625vw);
        border: 2px solid rgba(255, 255, 255, 0.2);

        h2 {
            margin: 0;
            font-size: 20px;
        }
    }

    .musicToDisplay {

        .album-cover {
            width: 19.53125vw;
            height: 19.53125vw;
            border-radius: 1.171875vw;
            box-shadow: 0 0.78125vw 2.34375vw rgba(0, 0, 0, 0.3);
            border: 0.234375vw solid rgba(255, 255, 255, 0.1);
        }
    }

    .input-container {
        display: flex;
        gap: 0.78125vw;

        input {
            width: 23.4375vw;
            padding: 15px 25px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            background-color: rgba(255, 255, 255, 0.1);
            color: white;
            border-radius: 1.953125vw;
            outline: none;
            font-size: 1.25vw;
            backdrop-filter: blur(0.390625vw);

            &::placeholder {
                color: rgba(255, 255, 255, 0.7);
            }
        }

        button {
            padding: 15px 25px;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: none;
            border-radius: 1.953125vw;
            cursor: pointer;
            font-size: 1.25vw;

            &:hover {
                background: rgba(255, 255, 255, 0.3);
            }
        }
    }

    .music-info {
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

        button {
            padding: 15px 25px;
            background: rgba(255, 255, 255, 0.1);
            color: white;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 1.953125vw;
            cursor: pointer;
            font-size: 1vw;
            transition: transform 0.3s ease;
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