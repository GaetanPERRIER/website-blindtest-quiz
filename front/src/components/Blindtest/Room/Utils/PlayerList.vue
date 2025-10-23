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

// Surveillez le changement de gameEnded pour capturer la liste des joueurs
watch(() => props.gameEnded, (newVal) => {
    if (newVal) {
        // Quand la partie se termine, on capture la liste actuelle des joueurs
        finalPlayerList.value = [...room.value.players];
    }
});

onMounted(() => {
    // Handle player join and player ejected
    socket.off("playerListUpdated")
    socket.on('playerListUpdated', (roomPlayers) => {
        // Ne mettez à jour que si la partie n'est pas terminée
        if (!props.gameEnded) {
            playerStore.SetRoomPlayers(roomPlayers)
            const player = roomPlayers.find(player => player.socketId === socket.id)
            if (!player) {
                router.push("/blindtest");
            }
        }
        console.log("[The player list has been updated] :", room.value.players)
    })
})

</script>

<template>
    <div :class="playing ? 'player-list-container' : 'player-list-container w100 h100'">
        
        <!-- Liste des joueurs pour le lobby de config -->
        <div v-if="!playing && !gameEnded" class="player-list u-flex u-flex-direction-column">
            <div  class="top-player-list u-flex u-align-items-center u-justify-content-center u-gap20 u-p15">
                <h2 class="t-body-text t-color-white">Liste des joueurs</h2>
                <InviteButton/>
            </div>
            <div class="content-player-list w100 h100 u-p10 u-plr20 u-flex u-flex-direction-column u-gap10">
                <Player v-for="player in room.players" :player="player"></Player>
            </div>
        </div>

        <!-- Liste des joueurs pour l'affichage de fin de partie -->
        <div v-if="!playing && gameEnded" class="player-list u-flex u-flex-direction-column">
            <div class="content-player-list w100 h100 u-p10 u-plr20 u-flex u-flex-direction-column u-gap10">
                <Player v-for="player in room.players" :player="player" :player-options="false"></Player>
            </div>
        </div>

        <!-- Liste des joueurs pour une manche en cours -->
        <div v-if="playing" class="player-list u-flex u-flex-direction-column">
            <div class="content-player-list w100 u-p10 u-plr20 u-flex u-flex-direction-row u-gap25">
                <Player v-for="player in staticPlayerList" :player="player" :player-list="false" :player-stat="true" :style="player.titleGuessed ? 'opacity:100%;' : 'opacity:50%;'"></Player>
            </div>
        </div>
    </div>

</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings';


.player-list-container {
    overflow: hidden;

    h2 {
        font-weight: 500;
        font-size: 22px;
    }
    .player-list {
        height: 100%;
        background-color: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-radius: 15px;

        .top-player-list {
            border-bottom: 2px solid rgba(255, 255, 255, 0.2);
        }

        .content-player-list {
            overflow: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(0, 0, 0, 0.5) transparent;

            &::-webkit-scrollbar-thumb {
                background-color: rgba(0, 0, 0, 0.5);
                border-radius: 10px;
            }

            &::-webkit-scrollbar {
                width: 8px;
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