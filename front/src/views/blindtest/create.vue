<script setup>
import {usePlayerStore} from "@/stores/playerStore.js";
import { useRouter, useRoute } from 'vue-router';
import socket from "@/utils/socket.js";
import ParticleBackground from "@/components/Basics/ParticleBackground.vue";
import BackNavigationArrow from "@/components/Basics/BackNavigationArrow.vue";
import {computed, onMounted, ref} from "vue";

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
    <BackNavigationArrow path="/"/>
    <div class="blindtest-create-container u-flex u-justify-content-center u-flex-direction-column u-align-items-center">
        <input class="t-body-text" v-model="username"  type="text" placeholder="Nom du joueur" />
        <p class="t-body-text" v-if="!roomIdInUrl" @click="SaveUsername">Créer le lobby</p>
        <p class="t-body-text" v-else @click="JoinRoom(route.query.roomId)">Rejoindre le lobby</p>
    </div>
    <ParticleBackground/>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

.blindtest-create-container {
    width: 100vw;
    height: 100vh;
    gap: 15px;

    input, p {
        width: 350px;
        padding: 10px 25px;
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
        border-radius: 10px;
        text-align: center;
        color: rgba(255, 255, 255, 0.8);
        transition: all 200ms $authenticMotion;
        line-height: 35px;

        &:focus {
            outline: none;
            border-color: rgba(255, 255, 255, 0.6);
        }

        &::placeholder {
            color: rgba(255, 255, 255, 0.5);
        }
    };

    p {
        cursor: pointer;
        &:hover {
            transform: scale(1.1);
            background-color: rgba(255, 255, 255, 0.3);
            color: rgba(255, 255, 255, 1);
        }
    }
}

</style>