<script setup>
import { useRouter, useRoute } from "vue-router";
import {usePlayerStore} from "@/stores/playerStore.js";
import ParticleBackground from "@/components/Basics/ParticleBackground.vue";
import ConfigLobby from "@/components/Blindtest/ConfigLobby.vue";
import MusicGuessing from "@/components/Blindtest/Game/MusicGuessing.vue";
import socket from "@/utils/socket.js";
import {computed, onMounted} from "vue";
import BackNavigationArrow from "@/components/Basics/BackNavigationArrow.vue";

const playerStore = usePlayerStore()
const router = useRouter();
const route = useRoute();


const urlTrackList = "https://api.deezer.com/playlist/53362031/tracks"
const player = computed(() => playerStore.player);
const room = computed(() => playerStore.room);

const inviteUrl = computed(() => {
    if (player.value.roomId) {
        return `${window.location.origin}/blindtest/play?roomId=${player.value.roomId}`;
    }
    return "";
});

onMounted(() => {
    // Créer la session multijoueur
    if (player.value.username !== ""){
        const playerData = {
            host : true,
            roomId : route.query.roomId ? route.query.roomId : player.value.roomId,
            username : player.value.username,
            socketId : socket.id,
        }
        socket.emit("joinRoom", playerData);

        socket.on('roomCreated', (data) => {
            playerData.roomId = data.roomId;
            playerStore.setPlayer(playerData);
        });

        socket.on('roomDataUpdated', (data) => {
            console.log("roomDataUpdated", data);
            playerStore.setRoom(data);

            const player = data.players.find(player => player.socketId === socket.id);
            if (player) {
                playerStore.setPlayer(player);
            }
            else {
                router.push("/blindtest");
            }
        });
    }
    else {
        route.query.roomId ? router.push(`/blindtest?roomId=${route.query.roomId}`) : router.push("/blindtest/");
    }
});




</script>

<template>

    <div v-if="!room.gameStarted" class="blindtest-container u-flex u-justify-content-center u-align-items-center u-p25 u-gap100">
        <ConfigLobby/>
    </div>

    <div v-else class="blindtest-container">
        <div class="musics-container">
            <MusicGuessing/>
        </div>
    </div>
    <ParticleBackground/>
</template>

<style scoped lang="scss">

.blindtest-container {
    width: 100vw;
    height: 100vh;
    position: relative;
    z-index: 1;


    h1 {
        font-size: 30px;
        color: #fff;
        text-align: center;
        margin-top: 20px;
        width: 100%;
        height: 35px;
        overflow: hidden;
    }

    .musics-container {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
    }

    input, button  {
        width: 450px;
        padding: 12px 15px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
        border-radius: 25px;
        outline: none;
        font-size: 16px;
        backdrop-filter: blur(5px);
        text-align: center;
    }

    button {
        width: 300px;
        cursor: pointer;
    }

    input {
        cursor: text;
    }


    &::placeholder {
        color: rgba(255, 255, 255, 0.7);
    }



}
</style>