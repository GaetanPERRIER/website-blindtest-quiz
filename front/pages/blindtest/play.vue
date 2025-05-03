<script setup>
import { useRouter, useRoute } from "vue-router";
import {usePlayerStore} from "~/stores/player.js";
import {useMusicStore} from "~/stores/musics.js";
import ParticleBackground from "~/components/ParticleBackground.vue";
import socket from "~/utils/socket.js";

const musicStore = useMusicStore()
const playerStore = usePlayerStore()
const router = useRouter();
const route = useRoute();

const player = computed(() => playerStore.player);


onMounted(() => {
    // Créer la session multijoueur
    console.log(player.value.username);
    console.log("Component mounted : Blindtest Create");

    if (player.value.username !== ""){
        const playerData = {
            host : true,
            roomId : route.query.roomId ? route.query.roomId : player.value.roomId,
            username : player.value.username,
            socketId : socket.id,
        }
        socket.emit("playerData", playerData);
        socket.on('roomCreated', (data) => {
            playerData.roomId = data.roomId;
            playerStore.setPlayer(playerData);
        });
    }
    else {
        route.query.roomId ? router.push(`/blindtest/create?roomId=${route.query.roomId}`) : router.push("/blindtest/create");
    }
});



function JoinRoom(){

}

</script>

<template>
    <div class="blindtest-container u-flex u-flex-direction-column u-justify-content-center u-align-items-center">
        <p> {{ route.fullPath }}</p>
        <p> {{ player.username }}</p>
        <p> {{ player.roomId }}</p>
    </div>
    <ParticleBackground/>

</template>

<style scoped lang="scss">
.blindtest-container {
    width: 100vw;
    height: 100vh;
    position: relative;
    z-index: 1;




}
</style>