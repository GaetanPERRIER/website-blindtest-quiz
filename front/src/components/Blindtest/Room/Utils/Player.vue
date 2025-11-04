<script setup>

import socket from "@/utils/socket.js";
import {usePlayerStore} from "@/stores/playerStore.js";
import {computed} from "vue";

const playerStore = usePlayerStore();
const room = computed(() => playerStore.room);
const currentPlayer = computed(() =>
    playerStore.room.players.find(player => player.socketId === socket.id)
)

const props = defineProps({
    player : {
        type: Object,
        required: true
    },
    playerOptions : {
        type : Boolean,
        default : true
    },
    playerStat : {
        type: Boolean,
        default : false
    }
})

function ejectPlayer() {
    if (!currentPlayer.value?.host || !props.player?.socketId){
        return
    }
    const roomId = room.value.id;
    socket.emit("ejectPlayer", roomId, props.player.socketId);
}

</script>

<template>
    <div class="player u-flex w100 u-align-items-center u-justify-content-between u-gap20">
        <div class="u-flex u-align-items-center u-gap10">
            <img class="player-avatar" src="/Player/panda.png" alt="">
            <span class="t-body-text t-color-white">{{ player.username }}</span>
        </div>
        <img v-if="playerOptions && !player.host" @click="ejectPlayer" class="cross" src="/Player/cross.png" alt="">
        <img v-if="playerOptions && player.host" class="cross" src="/Player/crown.png" alt="">
    </div>
</template>

<style scoped lang="scss">

.player {
    .awnser-not-guessed {
        opacity: 50%;
    }

    .awnser-guessed {
        opacity: 100%;
    }

    .player-avatar {
        width: 40px;
        height: 40px;
    }

    .cross {
        width: 30px;
        height: 30px;
        cursor: pointer;
        transition: all 200ms $authenticMotion;

        &:hover {
            transform: scale(1.05);
        }
    }
}

</style>