<script setup>
import {usePlayerStore} from "@/stores/playerStore.js";
import { useRouter, useRoute } from 'vue-router';
import socket from "@/utils/socket.js";
import ParticleBackground from "@/components/Basics/ParticleBackground.vue";
import BackNavigationArrow from "@/components/Basics/BackNavigationArrow.vue";
import {computed, onMounted, ref} from "vue";
import ScaleSpawnAnimation from "@/components/Basics/ScaleSpawnAnimation.vue";


/* Variables */
const router = useRouter();
const route = useRoute();
const playerStore = usePlayerStore()
const username = ref("");
const roomIdInUrl = computed(() => !!route.query.roomId);
const errorMessage = ref("");
const showError = ref(false);

/* Handle Spawn Animation */
const formVisible = ref(false)

onMounted(() => {
    formVisible.value = !formVisible.value
})

/* Functions */
function validateUsername() {
    if (username.value.trim() === "") {
        errorMessage.value = "Veuillez entrer un nom d'utilisateur valide.";
        showError.value = true;
        return false;
    }
    if (username.value.length > 20) {
        errorMessage.value = "Le nom d'utilisateur ne doit pas dépasser 20 caractères.";
        showError.value = true;
        return false;
    }
    showError.value = false;
    return true;
}

function SaveUsername() {
    if (!validateUsername()) return;

    const playerData = {
        host : true,
        roomId : route.query.roomId ? route.query.roomId : null,
        username : username.value,
        socketId : socket.id,
        isReady : true
    }
    socket.emit("joinRoom", playerData);
    router.push("/blindtest/play");
}

function JoinRoom(roomId) {
    if (!validateUsername()) return;

    const playerData = {
        host: false,
        roomId: roomId,
        username: username.value,
        socketId: socket.id,
        isReady : true
    }
    socket.emit("joinRoom", playerData);
    router.push(`/blindtest/play`);
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
            <ScaleSpawnAnimation>
                <div class="form-container" v-if="formVisible">
                    <h2 class="page-title">Rejoindre une partie</h2>

                    <div class="input-group">
                        <input v-model="username" @input="limitCharacters" type="text" placeholder="Nom du joueur" class="username-input t-body-text" maxlength="20"/>
                        <div class="character-counter">
                            {{ username.length }}/20
                        </div>
                    </div>

                    <button v-if="!roomIdInUrl" @click="SaveUsername" class="action-button t-body-text">
                        Créer un lobby
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>

                    <button v-else @click="JoinRoom(route.query.roomId)" class="action-button t-body-text">
                        Rejoindre le lobby
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>

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
    justify-content: center;
    align-items: center;
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