<script setup>
import socket from "@/utils/socket.js";
import { usePlayerStore} from "@/stores/playerStore.js";
import { computed, onMounted, ref, watch} from "vue";

const playerStore = usePlayerStore()

const room = computed(() => playerStore.room);
const difficulty = computed(() => playerStore.room.difficulty)
const currentPlayer = computed(() => playerStore.player)

const songCount = computed(() => playerStore.room.songCount);

function setSongCount(event) {
    socket.emit("select song count", room.value.id, event.target.value);
}


function setActiveButton(event) {
    if (event.target.id === difficulty.value)
        return;

    const buttons = document.querySelectorAll('.button-container button');
    buttons.forEach(button => {
        button.classList.remove('btn-active');
    });
    event.target.classList.add('btn-active');

    socket.emit("select difficulty", room.value.id, event.target.id);
}



</script>

<template>
    <div class="room-settings u-flex u-flex-direction-column h100 w50">
        <h2 class="t-title t-color-white">Room Settings</h2>
        <div>
            <label class="t-body-text t-color-white">Difficulté</label>
            <div class="button-container u-flex w100 u-justify-content-center u-gap10 u-mt10">
                <button @click="setActiveButton" :class="difficulty === 'easy' ? 't-body-text btn-active' : 't-body-text'" id="easy" :disabled="!currentPlayer.host">Facile</button>
                <button @click="setActiveButton" :class="difficulty === 'medium' ? 't-body-text btn-active' : 't-body-text'" id="medium" :disabled="!currentPlayer.host">Moyen</button>
                <button @click="setActiveButton" :class="difficulty === 'hard' ? 't-body-text btn-active' : 't-body-text'" id="hard" :disabled="!currentPlayer.host">Difficile</button>
            </div>
        </div>
        <div class="vinyl-container u-flex u-flex-direction-column u-justify-content-center u-align-items-center u-gap10">
            <img src="/Settings/vinyl.png" alt="">
            <div class="mixer-control u-flex u-flex-direction-column u-align-items-center">
                <div class="track-count-display t-body-text t-color-white">{{songCount}} musiques</div>
                <input type="range" min="5" max="20" v-model="songCount" class="track-count-slider" @change="setSongCount" :disabled="!currentPlayer.host">
            </div>
        </div>
        <div class="w100 u-flex u-justify-content-center u-align-items-center">
            <button class="play-button t-body-text" :disabled="!currentPlayer.host">Lancer la partie</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

// Créer une transition de rotation pour l'élément vinyl
@keyframes vinyl-rotation {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}


.room-settings {
    padding: 10px;
    justify-content: space-around;

    .button-container {
        button {
            display: flex;
            width: 100%;
            padding: 10px 25px;
            border-radius: 10px;
            font-size: 18px;
            cursor: pointer;
            background-color: rgba(0, 0, 0, 0.5);
            color: #fff;
            transition: all 200ms $authenticMotion;
            text-align: center;

            &:hover {
                background-color: rgba(0, 0, 0, 0.7);
                transform: scale(1.05);
            }

            &:disabled {
                cursor: not-allowed;
            }
        }

        .btn-active {
            background-color: $major-yellow-color;
            color: #fff;

            &:hover {
                background-color: darken($major-yellow-color, 10%);
                transform: scale(1.1);
            }
        }

    }

    .vinyl-container {
        width: 100%;
        padding: 0 50px;

        img {
            width: 100%;
            animation: vinyl-rotation 10s linear infinite;
        }

        .mixer-control {
            width: 100%;
            position: relative;


            .track-count-slider {
                -webkit-appearance: none;
                width: 100%;
                height: 10px;
                background: linear-gradient(161deg,rgba(255, 223, 107, 1) 0%, rgba(255, 110, 110, 1) 48%, rgba(115, 173, 201, 1) 80%, rgba(56, 159, 255, 1) 100%);
                border-radius: 5px;
                outline: none;
                margin: 15px 0;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

                &::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #fff;
                    cursor: pointer;
                    border: 3px solid $major-yellow-color;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                    transition: all 0.2s $authenticMotion;

                    &:hover {
                        transform: scale(1.1);
                        background: $major-yellow-color;
                    }
                }

                &::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: #fff;
                    cursor: pointer;
                    border: 3px solid $major-yellow-color;
                    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
                    transition: all 0.2s $authenticMotion;

                    &:hover {
                        transform: scale(1.1);
                        background: $major-yellow-color;
                    }
                }
            }

            .track-count-slider:disabled::-webkit-slider-thumb {
                cursor: not-allowed;
            }

            .track-count-slider:disabled::-moz-range-thumb {
                cursor: not-allowed;
            }

            .track-count-display {
                background: rgba(0, 0, 0, 0.7);
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 14px;
                white-space: nowrap;
                width: fit-content;
            }
        }
    }

    .play-button {
        display: flex;
        padding: 10px 25px;
        border-radius: 10px;
        font-size: 18px;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
        transition: all 200ms $authenticMotion;
        text-align: center;

        &:hover {
            background-color: rgba(0, 0, 0, 0.7);
            transform: scale(1.05);
        }

        &:disabled {
            cursor: not-allowed;
        }
    }
}

@media (max-width: 1000px) {
    .room-settings {
        width: 100% !important;
        padding: 10px;
        height: fit-content;
        align-items: center;
        justify-content: start;
        gap: 10px;

        .vinyl-container {
            img {
                display: none;
            }
        }
    }
}

@media (max-width: 450px) {
    .button-container {
        flex-wrap: wrap;
    }

    .vinyl-container {
        padding: 0 !important;
    }

}

</style>