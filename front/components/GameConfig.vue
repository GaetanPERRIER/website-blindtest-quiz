<script setup>
import { ref } from 'vue';
import socket from "~/utils/socket.js";

const playerStore = usePlayerStore();
const bgGradient = computed(() => playerStore.bgGradient);

const room = computed(() => playerStore.room);
const currentPlayer = computed(() => playerStore.player);


// Variable pour stocker la valeur locale de songCount et la difficulté
const localSongCount = ref(room.value.songCount);
const localDifficulty = ref(room.value.difficulty);




onMounted(() => {
    const gradientElement = document.querySelector(".lobby-config button");
    if (gradientElement) {
        gradientElement.style.background = bgGradient.value;

        gradientElement.style.backgroundSize = "500%";
        gradientElement.style.backgroundPosition = "center";
    }

    const gradientElement2 = document.querySelector(".lobby-config select");
    if (gradientElement2) {
        gradientElement2.style.background = bgGradient.value;

        gradientElement2.style.backgroundSize = "500%";
        gradientElement2.style.backgroundPosition = "center";
    }

    const gradientElement3 = document.querySelector(".music-count-container input[type='range']");
    if (gradientElement3) {
        gradientElement3.style.background = bgGradient.value;

        gradientElement3.style.backgroundSize = "500%";
        gradientElement3.style.backgroundPosition = "center";
    }
});


// Fonction pour démarrer le jeu
const StartGame = () => {
    if (room.value.category === null || !currentPlayer.value.host) {
        return;
    }
    socket.emit("start game", room.value.id, room.value.category.tracklist, room.value.songCount, room.value.difficulty);

};

// Fonction pour mettre à jour la valeur dans le store
const updateSongCount = (newValue) => {
    socket.emit('select song count', room.value.id, newValue);
};

// Fonction pour mettre à jour la difficulté dans le store
const updateDifficulty = (newValue) => {
    socket.emit('select difficulty', room.value.id, newValue);
};

// Utilisez un watcher pour surveiller les changements de room.value.songCount
watch(() => room.value.songCount, (newValue) => {
    localSongCount.value = newValue;
});

// Utilisez un watcher pour surveiller les changements de room.value.difficulty
watch(() => room.value.difficulty, (newValue) => {
    localDifficulty.value = newValue;
});


</script>

<template>
    <div class="game-config">
        <div class="vinyl-container">
            <img class="circle" src="/vinyl.png" alt="">
            <img v-if="room && room.category" :src="room.category.picture_big" alt="" class="choosen-category">
        </div>
        <div class="lobby-config">
            <div class="music-count-container">
                <label for="musicCount">Song count : {{ localSongCount }}</label>
                <input name="musicCount"  type="range" min="5" max="20" v-model="localSongCount" @change="updateSongCount(localSongCount)" />
            </div>

            <select v-model="localDifficulty" @change="updateDifficulty(localDifficulty)">
                <option value="easy">Easy</option>
                <option value="normal">Normal</option>
                <option value="hard">Hard</option>
            </select>

            <button :class="room.category === null || !currentPlayer.host ? 'button-disabled' : ''" @click="StartGame">Start</button>
        </div>
    </div>
</template>

<style scoped lang="scss">

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.game-config {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1.171875vw;
    height: 100%;

    .vinyl-container {
        position: relative;
        height: 85%;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: spin 10s linear infinite;


        .circle {
            height: 140%;
            position: relative;
        }

        .choosen-category {
            position: absolute;
            width: 9.375vw;
            height: 9.375vw;
            background-color: #00dbde;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
    }

    .lobby-config {
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        width: 100%;
        height: 15%;
        padding: 10px;
        gap: 30px;

        select {
            width: 150px;
            border-radius: 0.78125vw;
            border: none;
            padding: 1.388888888888889vh 1.041666666666667vw;
            box-shadow: 0 0.2083333333333333vw 0.4166666666666667vw rgba(0, 0, 0, 0.2);
            color: white;
            cursor: pointer;
            font-size: 0.9375vw;

            option {
                color: black;
            }

        }

        .music-count-container {
            width: 150px;
            label {
                width: 100%;
                color: white;
                font-size: 0.9375vw;
            }

            input[type="range"] {
                -webkit-appearance: none;
                width: 100%;
                height: 0.2083333333333333vw;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 0.78125vw;
                box-shadow: 0 0.2083333333333333vw 0.4166666666666667vw rgba(0, 0, 0, 0.2);
                outline: none;
                cursor: pointer;
            }
        }


        button {
            width: 150px;
            color: white;
            border-radius: 0.78125vw;
            cursor: pointer;
            padding: 1.388888888888889vh 1.041666666666667vw;
            box-shadow: 0 0.2083333333333333vw 0.4166666666666667vw rgba(0, 0, 0, 0.2);
            font-size: 0.9375vw;
            transition: transform 250ms ease;

            &:hover {
                transform: scale(1.03);
            }
        }

        .button-disabled {
            background: rgba(255, 255, 255, 0.2) !important;
            cursor: not-allowed;
            box-shadow: none;
        }
    }


}


</style>