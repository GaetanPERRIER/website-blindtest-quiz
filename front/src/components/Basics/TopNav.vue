<script setup>

import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { friendService } from '@/services/friend.service.js'
import { supabase } from '@/services/supabase.js'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const username = ref('')
const avatarUrl = ref('')

const pendingRequests = ref([])
const showRequests = ref(false)
const panelRef = ref(null)

const loading = ref(false)
const error = ref(null)

const pendingCount = computed(() => pendingRequests.value.length)

async function loadUserProfile(user) {
    if (!user) {
        username.value = ''
        avatarUrl.value = ''
        pendingRequests.value = []
        return
    }

    try {
        const { data } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', user.id)
            .single()

        username.value =
            data?.username ||
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            ''

        avatarUrl.value =
            data?.avatar_url ||
            user.user_metadata?.avatar_url ||
            ''
    } catch (e) {
        console.error(e)

        username.value =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            ''

        avatarUrl.value =
            user.user_metadata?.avatar_url ||
            ''
    }
}

async function fetchPendingRequests() {
    if (!authStore.user) {
        pendingRequests.value = []
        return
    }

    try {
        pendingRequests.value =
            await friendService.getPendingRequests(authStore.user.id)
    } catch (e) {
        console.error(e)
    }
}

async function acceptRequest(requestId) {
    try {
        await friendService.acceptRequest(requestId)

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

    try {
        await authStore.signInWithGoogle()
    } catch (err) {
        error.value = 'Failed to connect with Google. Please try again.'
        console.error(err)
    } finally {
        loading.value = false
    }
}

watch(() => authStore.user, async user => {
        await loadUserProfile(user)
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

</script>

<template>
    <div class="top-nav">
        <div class="user-menu" v-if="authStore.user">

            <!-- Friend requests button -->
            <div class="requests-wrapper" ref="panelRef">
                <button class="requests-btn" @click="toggleRequests" :class="{ active: showRequests }">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="currentColor"/>
                    </svg>
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
                                <img
                                    :src="req.user.avatar_url || 'https://via.placeholder.com/32'"
                                    class="req-avatar"
                                    :alt="req.user.username"
                                />
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
            </div>

            <button @click="logout" class="btn-ghost btn-sm">Logout</button>
        </div>

        <div v-if="!authStore.user && route.fullPath !== '/login'" class="user-menu-logged-out">
            <button @click="loginWithGoogle" class="btn-ghost btn-sm">Sign In / Log In</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
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

.user-menu-logged-out {
    display: flex;
    align-items: center;
    gap: $spacing-lg;
    backdrop-filter: blur($blur-md);
    padding: $spacing-sm $spacing-lg;
    border-radius: 50px;
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
</style>