<script setup>

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { friendService } from '@/services/friend.service.js'
import { Users } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const username = computed(() =>
    authStore.user?.username || ''
)

const avatarUrl = computed(() =>
    authStore.user?.avatar_url || ''
)

const pendingRequests = ref([])
const showRequests = ref(false)
const panelRef = ref(null)

const loading = ref(false)
const error = ref(null)

const pendingCount = computed(() => pendingRequests.value.length)

async function fetchPendingRequests() {
    if (!authStore.user) {
        pendingRequests.value = []
        return
    }

    try {
        pendingRequests.value =
            await friendService.getPendingRequests(authStore.token)
    } catch (e) {
        console.error(e)
    }
}

async function acceptRequest(requestId) {
    try {
        await friendService.acceptRequest(requestId, authStore.token)

        pendingRequests.value = pendingRequests.value.filter(
            r => r.id !== requestId
        )
    } catch (e) {
        console.error(e)
    }
}

function toggleRequests() {
    showRequests.value = !showRequests.value
}

function handleClickOutside(e) {
    if (panelRef.value && !panelRef.value.contains(e.target)) {
        showRequests.value = false
    }
}

function goToDashboard() {
    router.push('/dashboard')
}

async function logout() {
    await authStore.signOut();
    router.push('/')
}

async function loginWithGoogle() {
    loading.value = true
    error.value = null
    authStore.signInWithGoogle()
}

watch(() => authStore.user, async () => {
        await fetchPendingRequests()
    },
    {
        immediate: true
    }
)

onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
    document.removeEventListener('mousedown', handleClickOutside)
})

function goToAdmin() {
    router.push('/admin')
}

function goToHome() {
    router.push('/')
}

</script>

<template>
    <div class="top-nav">
        <div class="site-logo" @click="goToHome" title="Accueil">
            <img src="/beatquiz-favicon.svg" alt="Logo" />
        </div>
        
        <div class="user-menu" v-if="authStore.isAuthenticated">

            <button v-if="authStore.isAdmin" class="admin-btn requests-label t-body-text" @click="goToAdmin">Administration</button>

            <!-- Friend requests button -->
            <div class="requests-wrapper" ref="panelRef">

                <button class="requests-btn" @click="toggleRequests" :class="{ active: showRequests }">
                    <Users size="20"/>
                    <span class="requests-label t-body-text">Friends</span>
                    <span v-if="pendingCount > 0" class="badge">{{ pendingCount }}</span>
                </button>

                <!-- Dropdown panel -->
                <transition name="panel-slide">
                    <div v-if="showRequests" class="requests-panel">
                        <div class="panel-header">
                            <span class="t-body-text panel-title">Friend requests</span>
                            <span class="panel-count" v-if="pendingCount > 0">{{ pendingCount }} pending</span>
                        </div>

                        <div v-if="pendingRequests.length === 0" class="empty-state">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" opacity="0.4">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="currentColor"/>
                            </svg>
                            <p class="t-body-text">No pending requests</p>
                        </div>

                        <ul v-else class="requests-list">
                            <li v-for="req in pendingRequests" :key="req.id" class="request-item">
                                <img :src="req.user.avatar_url || 'https://via.placeholder.com/32'" class="req-avatar" :alt="req.user.username"/>
                                <span class="req-username t-body-text">{{ req.user.username }}</span>
                                <button class="accept-btn" @click="acceptRequest(req.id)" title="Accept">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </li>
                        </ul>
                    </div>
                </transition>
            </div>

            <!-- User profile -->
            <div class="user-profile-btn" @click="goToDashboard">
                <img :src="avatarUrl || 'https://via.placeholder.com/32'" class="nav-avatar" />
                <span class="t-body-text">{{ username }}</span>
                <span class="t-body-text text-role">{{ authStore.user.role}}</span>
            </div>

            <button @click="logout" class="btn-ghost btn-sm">Logout</button>
        </div>

        <div v-if="!authStore.loading && !authStore.isAuthenticated && route.fullPath !== '/login'" class="user-menu-logged-out">
            <button @click="loginWithGoogle" class="btn-ghost btn-sm">Sign In / Log In</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.top-nav {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-xl;
}

.site-logo {
    z-index: 100;
    cursor: pointer;
    transition: opacity 0.2s ease, transform 0.2s ease;
    
    
    img {
        height: 64px;
        width: auto;
        filter: brightness(0) invert(1);
    }

    &:hover {
        opacity: 0.85;
        transform: scale(1.05);
    }
}

/* même animation d'entrée que la user-menu, pour rester cohérent */
.site-logo {
    opacity: 0;
    animation:
        navFadeInOpacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards,
        navFadeInTransform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
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

.user-menu-logged-out {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
    backdrop-filter: blur($blur-md);
    padding: $spacing-sm $spacing-lg;
    border-radius: 50px;
}

/* ── Admin button ── */
.admin-btn {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 50px;
    padding: 6px 14px;
    color: rgba(255, 255, 255, 0.75);
    cursor: pointer;
    transition: background 0.2s, color 0.2s, border-color 0.2s;

    &:hover {
        background: rgba(255, 255, 255, 0.15);
        color: white;
        border-color: rgba(255, 255, 255, 0.3);
    }
}

/* ── Friend requests ── */
.requests-wrapper {
    position: relative;
}

.requests-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 50px;
    padding: 6px 14px;
    color: rgba(255, 255, 255, 0.75);
    cursor: pointer;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
    position: relative;

    &:hover,
    &.active {
        background: rgba(255, 255, 255, 0.15);
        color: white;
        border-color: rgba(255, 255, 255, 0.3);
    }
}

.requests-label {
    font-size: 14px;
}

.badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: linear-gradient(135deg, #FF6E6E, #FFDF6B);
    color: white;
    font-size: 10px;
    font-weight: 700;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    box-shadow: 0 2px 6px rgba(255, 110, 110, 0.5);
}

.requests-panel {
    position: absolute;
    top: calc(100% + 12px);
    right: 0;
    width: 280px;
    background: rgba(20, 20, 30, 0.85);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    overflow: hidden;
}

.panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px 10px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.panel-title {
    font-size: 13px;
    font-weight: 600;
    color: white;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    opacity: 0.7;
}

.panel-count {
    font-size: 12px;
    color: #FFDF6B;
}

.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 28px 16px;
    color: rgba(255, 255, 255, 0.4);

    p {
        font-size: 13px;
        margin: 0;
    }
}

.requests-list {
    list-style: none;
    margin: 0;
    padding: 6px 0;
    max-height: 260px;
    overflow-y: auto;

    &::-webkit-scrollbar {
        width: 4px;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    &::-webkit-scrollbar-thumb {
        background: rgba(255,255,255,0.15);
        border-radius: 4px;
    }
}

.request-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    transition: background 0.15s;

    &:hover {
        background: rgba(255, 255, 255, 0.05);
    }
}

.req-avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.2);
    object-fit: cover;
    flex-shrink: 0;
}

.req-username {
    flex: 1;
    font-size: 14px;
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.text-role {
    font-size: 12px;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 0.06em;
}

.text-role::before {
    content: '•';
    margin-right: $spacing-sm;
}

.accept-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: none;
    background: rgba(100, 220, 130, 0.15);
    color: #64DC82;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    flex-shrink: 0;

    &:hover {
        background: rgba(100, 220, 130, 0.3);
        transform: scale(1.1);
    }
}

/* ── User profile ── */
.user-profile-btn {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    cursor: pointer;
    transition: opacity 0.2s;

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

/* ── Transition ── */
.panel-slide-enter-active,
.panel-slide-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}
.panel-slide-enter-from,
.panel-slide-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}


/* -- Animation User Menu -- */
.user-menu,
.user-menu-logged-out {
    opacity: 0;
    animation:
        navFadeInOpacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards,
        navFadeInTransform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes navFadeInOpacity {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes navFadeInTransform {
    from {
        transform: translateY(-15px) scale(0.96);
    }
    to {
        transform: translateY(0) scale(1);
    }
}

</style>