<script setup>
import {usePlayerStore} from "@/stores/playerStore.js";
import {computed, onMounted, ref, watch} from "vue";
import socket from "@/utils/socket.js";
import { useRouter, useRoute } from "vue-router";
import InviteButton from "@/components/Blindtest/Room/Utils/InviteButton.vue";
import Player from "@/components/Blindtest/Room/Utils/Player.vue";

const props = defineProps({
    playing: {
        type: Boolean,
        default: false
    },
    gameEnded: {
        type: Boolean,
        default: false
    }
})

const router = useRouter();
const route = useRoute();
const playerStore = usePlayerStore();
const room = computed(() => playerStore.room);
const finalPlayerList = ref([])

watch(() => props.gameEnded, (newVal) => {
    if (newVal) {
        finalPlayerList.value = [...room.value.players];
    }
});

onMounted(() => {
    // Handle player join and player ejected
    socket.off("playerListUpdated")
    socket.on('playerListUpdated', (roomPlayers) => {
        if (!props.gameEnded) {
            playerStore.room.players = roomPlayers
            const player = roomPlayers.find(player => player.socketId === socket.id)
            if (!player) {
                router.push("/");
            }
        }
    })
})

</script>

<template>
    <div :class="playing ? 'player-list-container' : 'player-list-container w100 h100'">
        
        <!-- Lobby config player list -->
        <div v-if="!playing && !gameEnded" class="player-list u-flex u-flex-direction-column">
            <div class="top-player-list u-flex u-align-items-center u-justify-content-between u-gap20 u-p15">
                <h2 class="t-body-text t-color-white">Players</h2>
                <InviteButton/>
            </div>
            <div class="content-player-list w100 h100 u-p10 u-plr20 u-flex u-flex-direction-column u-gap10">
                <Player v-for="(player, index) in room.players" :key="player.socketId" :player="player" :index="index"></Player>
            </div>
        </div>

        <!-- End of game player list -->
        <div v-if="!playing && gameEnded" class="player-list u-flex u-flex-direction-column">
            <div class="content-player-list w100 h100 u-p10 u-plr20 u-flex u-flex-direction-column u-gap10">
                <Player v-for="(player, index) in room.players" :key="player.socketId" :player="player" :player-options="false" :index="index"></Player>
            </div>
        </div>

        <!-- In-round player list -->
        <div v-if="playing" class="player-list u-flex u-flex-direction-column">
            <div class="content-player-list w100 u-p10 u-plr20 u-flex u-flex-direction-row u-gap25">
                <Player v-for="(player, index) in room.players" :key="player.socketId" :player="player" :player-list="false" :player-stat="true" :index="index" :style="player.titleGuessed ? 'opacity:100%;' : 'opacity:50%;'"></Player>
            </div>
        </div>
    </div>

</template>

<style scoped lang="scss">


.player-list-container {
    height: 100%;
    overflow: hidden;

    h2 {
        font-weight: 600;
        font-size: $font-size-lg;
    }
    .player-list {
        height: 100%;
        background-color: $color-surface;
        border: 1px solid $color-border;
        border-radius: $radius-lg;

        .top-player-list {
            border-bottom: 1px solid $color-border;
        }

        .content-player-list {
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: $color-border transparent;

            &::-webkit-scrollbar-thumb {
                background-color: $color-border;
                border-radius: $radius-full;
            }

            &::-webkit-scrollbar {
                width: 4px;
            }

            &::-webkit-scrollbar-track {
                background-color: transparent;
            }
        }

    }
}


@media (max-width: 1000px) {
    .player-list {
        display: none !important;
    }

}





</style>