<script setup>
import {usePlayerStore} from "@/stores/playerStore.js";
import { useRouter, useRoute } from 'vue-router';
import socket from "@/utils/socket.js";
import ParticleBackground from "@/components/Basics/ParticleBackground.vue";
import BackNavigationArrow from "@/components/Basics/BackNavigationArrow.vue";
import {computed, onMounted, ref} from "vue";
import ScaleSpawnAnimation from "@/components/Basics/ScaleSpawnAnimation.vue";
import SoundVolume from "@/components/Blindtest/Game/Utils/SoundVolume.vue";


const router = useRouter();
const route = useRoute();
const playerStore = usePlayerStore()
const username = ref("");
const roomIdInUrl = computed(() => !!route.query.roomId);
const errorMessage = ref("");
const showError = ref(false);

const room = computed(() => playerStore.room);
const roomList = computed(() => playerStore.roomList)


onMounted(() => {
    socket.emit("getRooms")
    socket.on("roomList", (newRoomList) => {
        playerStore.setRoomList(newRoomList)
    })

    socket.off("roomCreated")
    socket.on('roomCreated', (newRoom) => {
        playerStore.setRoom(newRoom)
        router.push(`/play`);
    })

    socket.off("roomJoined")
    socket.on('roomJoined', (newRoom) => {
        playerStore.setRoom(newRoom)
        router.push(`/play`);
    })
})

/* Functions */
function validateUsername() {
    if (username.value.trim() === "") {
        errorMessage.value = "Please enter a valid username.";
        showError.value = true;
        return false;
    }
    if (username.value.length > 20) {
        errorMessage.value = "Username must not exceed 20 characters.";
        showError.value = true;
        return false;
    }
    showError.value = false;
    return true;
}

function JoinRoom(roomId) {
    if (!validateUsername()) return;

    const playerData = {
        host : roomId === null,
        roomId : roomId,
        username : username.value,
        socketId : socket.id,
        isReady : true,
        score : 0
    }
    
    socket.emit("joinRoom", playerData);
}

// Limite la saisie à 20 caractères
function limitCharacters() {
    if (username.value.length > 20) {
        username.value = username.value.substring(0, 20);
    }
}
</script>

<template>
    <div class="page-container">
        <main class="create-room-container">
            <div class="header-content u-flex-direction-column u-align-items-center u-gap10 u-mb40">
                <div class="logo">
                    <img src="/beatquiz-logo.svg" alt="BeatQuiz Logo" class="logo-img">
                    <span class="logo-text">BeatQuiz</span>
                </div>
                <p class="tagline">Guess the song. Beat your friends.</p>
            </div>
            
            <ScaleSpawnAnimation>
                <div class="form-container">

                    <div class="input-group">
                        <input v-model="username" @input="limitCharacters" @keyup.enter="JoinRoom(roomIdInUrl ? route.query.roomId : null)" type="text" placeholder="Your username" class="username-input t-body-text" maxlength="20"/>
                        <div class="character-counter">
                            {{ username.length }}/20
                        </div>
                    </div>

                    <button v-if="!roomIdInUrl" @click="JoinRoom(null)" class="action-button t-body-text">
                        Create a lobby
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>

                    <div v-else class="u-flex-direction-column u-gap15">
                        <p class="invited-text t-body-text">You've been invited · Join as <strong>{{ username || '[pseudo]' }}</strong></p>
                        <button @click="JoinRoom(route.query.roomId)" class="action-button t-body-text">
                            Join the lobby
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2"/>
                            </svg>
                        </button>
                    </div>

                    <transition name="fade">
                        <div v-if="showError" class="error-message">
                            {{ errorMessage }}
                        </div>
                    </transition>
                </div>
            </ScaleSpawnAnimation>
        </main>

        <ParticleBackground/>
        
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

.page-container {
    width: 100%;
    min-height: 100vh;
    position: relative;
}

.create-room-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    gap: 50px;
    padding: 20px;
    position: relative;
    z-index: 2;
}

.form-container {
    width: 100%;
    max-width: 500px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.page-title {
    color: white;
    font-size: 36px;
    text-align: center;
    margin: 0 0 10px 0;
}

.input-group {
    width: 100%;
    position: relative;
}

.username-input {
    width: 100%;
    padding: 15px 25px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50px;
    font-size: 20px;
    color: white;
    text-align: center;
    transition: all 0.3s ease;

    &:focus {
        outline: none;
        border-color: $major-yellow-color;
        box-shadow: 0 0 0 2px rgba(255, 223, 107, 0.3);
    }

    &::placeholder {
        color: rgba(255, 255, 255, 0.6);
    }
}

.character-counter {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(255, 255, 255, 0.6);
    font-size: 12px;
    pointer-events: none;
}

.error-message {
    color: white;
    font-size: 14px;
    text-align: center;
    padding: 10px 15px;
    background: rgba(255, 50, 50, 0.8);
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

.action-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    background: linear-gradient(135deg, #FF6E6E 0%, #FFDF6B 100%);
    color: #fff;
    padding: 15px;
    border-radius: 50px;
    font-size: 20px;
    font-weight: 400;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(255, 110, 110, 0.4);

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(255, 110, 110, 0.6);
    }

    &:active {
        transform: translateY(-1px);
    }
}

@media (max-width: 600px) {
    .form-container {
        padding: 30px;
    }

    .page-title {
        font-size: 1.8rem;
    }
}

@media (max-width: 480px) {
    .form-container {
        padding: 25px 20px;
    }

    .page-title {
        font-size: 1.6rem;
    }

    .username-input, .action-button {
        padding: 12px 20px;
        font-size: 1rem;
    }

    .character-counter {
        right: 15px;
        font-size: 10px;
    }
}
</style>