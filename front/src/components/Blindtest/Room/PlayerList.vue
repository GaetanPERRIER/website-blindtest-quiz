<script setup>
import {usePlayerStore} from "@/stores/playerStore.js";
import {computed, onMounted} from "vue";
import socket from "@/utils/socket.js";
import InviteButton from "@/components/Blindtest/Room/InviteButton.vue";


defineProps({
    gameStatus: {
        type: Boolean,
        default: false
    }
})

const playerStore = usePlayerStore();
const room = computed(() => playerStore.room);
const currentPlayer = computed(() => playerStore.player);


function EjectAPlayer(event) {
    console.log("dzdz")
    const roomId = room.value.id;
    const socketId = event.target.dataset.socketId;

    socket.emit("eject player", roomId, socketId);
}
</script>

<template>
    <div class="player-list u-flex u-flex-direction-column">
        <div class="top-player-list u-flex u-align-items-center u-justify-content-center u-gap20 u-p15">
            <h2 class="t-title t-color-white">Lobby</h2>
            <InviteButton/>
        </div>
        <div class="content-player-list w100 u-p10 u-plr20 u-flex u-flex-direction-column u-gap10">
            <div v-for="player in room.players" class="player u-flex w100 u-align-items-center u-justify-content-between u-gap20">
                <div class="u-flex u-align-items-center u-gap10">
                    <img class="player-avatar" src="/Player/panda.png" alt="">
                    <span class="t-body-text t-color-white">{{ player.username }}</span>
                </div>
                <img @click="EjectAPlayer" class="cross" src="/Player/cross.png" alt="">
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

.player-list {
    background-color: rgba(255, 255, 255, 0.3);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 15px;

    .top-player-list {
        border-bottom: 2px solid rgba(255, 255, 255, 0.3);
    }

    .content-player-list {
        .player {
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

    }
}



</style>