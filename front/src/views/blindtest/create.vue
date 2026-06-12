<script setup>
import {usePlayerStore} from "@/stores/playerStore.js";
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { supabase } from '@/services/supabase';
import {computed, onMounted, ref, watch} from "vue";
import socket from "@/utils/socket.js";


/* Components */
import ParticleBackground from "@/components/Basics/ParticleBackground.vue";
import ScaleSpawnAnimation from "@/components/Basics/ScaleSpawnAnimation.vue";
import TopNav from "@/components/Basics/TopNav.vue";


/* Variables */
const router = useRouter();
const route = useRoute();

/* Stores */
const playerStore = usePlayerStore()
const authStore = useAuthStore()


const username = ref("");
const avatarUrl = ref("");
const roomIdInUrl = computed(() => !!route.query.roomId);
const errorMessage = ref("");
const showError = ref(false);


// Update username when user logs in or profile is fetched
onMounted(async () => {
    if (authStore.user) {
        const { data } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', authStore.user.id)
            .single();
        
        if (data && data.username) {
            username.value = data.username;
            avatarUrl.value = data.avatar_url;
        } else {
            username.value = authStore.user.user_metadata?.full_name || authStore.user.user_metadata?.name || "";
            avatarUrl.value = authStore.user.user_metadata?.avatar_url || "";
        }
    }
});

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

function goToDashboard() {
    router.push('/dashboard');
}

async function logout() {
    await authStore.signOut();
    router.push('/login');
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
        <TopNav :username="username" :avatarUrl="avatarUrl"/>
        <main class="create-room-container">
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

                    <div class="divider" v-if="!authStore.isAuthenticated && authStore.loading === false">
                        <span>OR</span>
                    </div>

                    <button v-if="!authStore.isAuthenticated && authStore.loading === false" @click="authStore.signInWithGoogle" class="google-button t-body-text">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pjax/google.png" alt="Google" width="18" height="18">
                        Sign in with Google
                    </button>
                </div>
            </ScaleSpawnAnimation>
        </main>
    </div>
</template>

<style scoped lang="scss">

.page-container {
    width: 100%;
    min-height: 100vh;
    position: relative;
}

.top-nav {
    position: absolute;
    top: $spacing-xl;
    right: $spacing-xl;
    z-index: 100;
}

.user-menu {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
    background: $color-surface;
    backdrop-filter: blur($blur-md);
    padding: $spacing-sm $spacing-lg;
    border-radius: 50px;
    border: 1px solid $color-border;
}

.user-profile-btn {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    cursor: pointer;
    transition: opacity $duration-fast;

    &:hover {
        opacity: 0.8;
    }
}

.nav-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid $color-accent;
    object-fit: cover;
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

.divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 10px 0;
    color: rgba(255, 255, 255, 0.4);
    font-size: 14px;

    &::before, &::after {
        content: '';
        flex: 1;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    span {
        padding: 0 10px;
    }
}

.google-button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    background: white;
    color: #333;
    padding: 12px;
    border-radius: 50px;
    font-size: 16px;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
        background: #f1f1f1;
        transform: translateY(-2px);
    }
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    margin-top: 5px;
}

.user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.2);
}

.user-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.user-name {
    margin: 0;
    color: white;
    font-size: 14px;
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