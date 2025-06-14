<script setup>
import {usePlayerStore} from "@/stores/playerStore.js";
import {computed, onMounted} from "vue";
import socket from "@/utils/socket.js";
import InviteButton from "@/components/Blindtest/Room/InviteButton.vue";
import Player from "@/components/Blindtest/Room/Utils/Player.vue";


defineProps({
    playing: {
        type: Boolean,
        default: false
    }
})

const playerStore = usePlayerStore();
const room = computed(() => playerStore.room);
const currentPlayer = computed(() => playerStore.player);



</script>

<template>
    <div v-if="!playing" class="player-list u-flex u-flex-direction-column">
        <div  class="top-player-list u-flex u-align-items-center u-justify-content-center u-gap20 u-p15">
            <h2 class="t-title t-color-white">Lobby</h2>
            <InviteButton/>
        </div>
        <div class="content-player-list w100 u-p10 u-plr20 u-flex u-flex-direction-column u-gap10">
            <Player v-for="player in room.players" :player="player" :player-list="true"></Player>
        </div>
    </div>

    <div v-if="playing" class="player-list u-flex u-flex-direction-column">
        <div class="content-player-list w100 u-p10 u-plr20 u-flex u-flex-direction-row u-gap25">
            <Player v-for="player in room.players" :player="player" :player-list="false" :style="player.titleGuessed ? 'opacity:100%;' : 'opacity:50%;'"></Player>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

.player-list {
    background-color: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 15px;

    .top-player-list {
        border-bottom: 2px solid rgba(255, 255, 255, 0.2);
    }

    .content-player-list {


    }
}

@media (max-width: 1000px) {
    .player-list {
        display: none !important;
    }

}





</style>