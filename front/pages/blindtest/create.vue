<script setup>
import {usePlayerStore} from "~/stores/player.js";
import { useRouter, useRoute } from 'vue-router';
import socket from "~/utils/socket.js";

const router = useRouter();
const route = useRoute();
const playerStore = usePlayerStore()
const username = ref("");
const publicRooms = ref([]);
const roomIdInUrl = computed(() => !!route.query.roomId);


function SaveUsername() {
    playerStore.setUsername(username.value);
    router.push("/blindtest/play");
}

function JoinRoom(roomId) {
    if (username.value === "") {
        alert("Veuillez entrer un nom d'utilisateur avant de rejoindre une salle.");
        return;
    }

    const playerData = {
        host: false,
        roomId: roomId,
        username: username.value,
        socketId: socket.id,
    }

    playerStore.setPlayer(playerData);
    router.push(`/blindtest/play`);

}

onMounted(() => {
    socket.emit("get rooms");
    socket.on("list rooms", (rooms) => {
        rooms.forEach(room => {
            if (room.players.length < 6) {
                publicRooms.value.push(room);
            }
        })
    })
})


</script>

<template>
    <div class="blindtest-create-container u-flex u-justify-content-center u-flex-direction-column u-align-items-center">
        <input v-model="username"  type="text" placeholder="Player name" />
        <p v-if="!roomIdInUrl" @click="SaveUsername">Create a room</p>
        <p v-else @click="JoinRoom(route.query.roomId)">Join the room</p>


        <!--
        <div v-if="!roomIdInUrl">
            <div v-for="room in publicRooms" :key="room.id" class="u-flex u-justify-content-center u-align-items-center">
                <p> Host : {{ room.players[0].username }}</p>
                <p>{{ room.players.length }}/6</p>
                <p @click="JoinRoom(room.id)">Join</p>
            </div>
        </div>
        -->
    </div>
    <ParticleBackground/>
</template>

<style scoped lang="scss">

.blindtest-create-container {
    width: 100vw;
    height: 100vh;
    gap :1.302083333333333vw;

    p {
        width: 15.625vw;
        cursor: pointer;
    }

    input {
        width: 15.625vw;
    }

    p, input {
        padding: 0.625vw 0.78125vw;
        border: 0.1041666666666667vw solid rgba(255, 255, 255, 0.3);
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
        border-radius: 1.302083333333333vw;
        outline: none;
        font-size: 0.9375vw;
        backdrop-filter: blur(0.2604166666666667vw);
        text-align: center;

        &::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }
    }
}

</style>