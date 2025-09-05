<script setup>

import LinearLoadingBar from "@/components/Blindtest/Game/LinearLoadingBar.vue";
import socket from "@/utils/socket.js";
import {computed, ref} from "vue";
import {usePlayerStore} from "@/stores/playerStore.js";

/* Computed datas from store */
const playerStore = usePlayerStore();

const room = computed(() => playerStore.room);
const currentPlayer = computed(() =>
    playerStore.room.players.find(player => player.socketId === socket.id)
)
/* Functions */
let userAnswer = ref("");

function CheckAnswer() {
    socket.emit("checkAnswer", room.value.id, currentPlayer.value.socketId, userAnswer.value);
    userAnswer.value = "";
}

</script>

<template>
    <div class="input-container u-flex u-flex-direction-column u-gap10">
        <div class="u-flex u-gap10">
            <input class="t-color-white t-body-text" v-model="userAnswer" type="text" placeholder="Saisir le nom de la musique..." @keydown.enter="CheckAnswer">
            <button class="t-body-text t-color-white" @click="CheckAnswer">Valider</button>
        </div>
        <LinearLoadingBar width="100%" transition-duration="30s"/>
    </div>
</template>

<style scoped lang="scss">

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
}

</style>