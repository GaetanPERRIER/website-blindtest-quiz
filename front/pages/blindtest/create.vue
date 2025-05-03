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

    console.log("Join room", roomId);

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
    <div class="blindtest-create-container u-flex u-justify-content-center u-flex-direction-column u-align-items-center u-gap25">
        <input v-model="username"  type="text" placeholder="Nom du joueur" />
        <p v-if="!roomIdInUrl" @click="SaveUsername">Créer un salon</p>
        <p v-else @click="JoinRoom(route.query.roomId)">Rejoindre le salon</p>

        <div v-if="!roomIdInUrl">
            <div v-for="room in publicRooms" :key="room.id" class="u-flex u-justify-content-center u-align-items-center">
                <p> Hôte : {{ room.players[0].username }}</p>
                <p>{{ room.players.length }}/6</p>
                <p @click="JoinRoom(room.id)">Rejoindre</p>
            </div>
        </div>




    </div>
    <ParticleBackground/>
</template>

<style scoped lang="scss">

.blindtest-create-container {
    width: 100vw;
    height: 100vh;

    p {
        width: 300px;
        cursor: pointer;
    }

    input {
        width: 300px;
    }

    p, input {
        padding: 12px 15px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        background-color: rgba(255, 255, 255, 0.1);
        color: white;
        border-radius: 25px;
        outline: none;
        font-size: 16px;
        backdrop-filter: blur(5px);
        text-align: center;

        &::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }
    }
}

</style>