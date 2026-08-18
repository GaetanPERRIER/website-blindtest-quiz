<script setup>
import { useAuthStore } from '@/stores/authStore';
import { useToastStore } from '@/stores/toastStore';
import { friendService } from '@/services/friend.service';
import { profileService } from '@/services/profile.service';
import ParticleBackground from "@/components/Basics/ParticleBackground.vue";
import { ref, onMounted, computed } from 'vue';
import { supabase } from '@/services/supabase';

const authStore = useAuthStore();
const toastStore = useToastStore();
const user = computed(() => authStore.user);
const profile = ref({
    username: '',
    avatar_url: ''
});
const friends = ref([]);
const pendingRequests = ref([]);
const searchQuery = ref('');
const searchResults = ref([]);
const loading = ref(false);
const saving = ref(false);
const activeTab = ref('profile'); // 'profile' or 'friends'
const friendToRemove = ref(null)



onMounted(async () => {
    if (user.value) {
        await fetchProfile();
        await fetchFriendsData();
    }
});

async function removeFriend() {
    try {
        await friendService.removeFriend(friendToRemove.value.id, authStore.token)
        friends.value = friends.value.filter(f => f.id !== friendToRemove.value.id)
        toastStore.addToast('Ami supprimé.')
    } catch (err) {
        toastStore.addToast('Erreur lors de la suppression.', 'error')
    } finally {
        friendToRemove.value = null
    }
}

async function fetchProfile() {
    const { data, error } = await supabase
        .from('profiles')
        .select('username, avatar_url')
        .eq('id', user.value.id)
        .single();
    
    if (data) {
        profile.value = data;
    } else {
        profile.value.username = user.value.username || '';
        profile.value.avatar_url = user.value.avatar_url || '';
    }
}

async function updateProfile() {
    // Validation cote client pour le confort de saisie uniquement :
    // le serveur (PATCH /api/profile/me) revalide et fait foi.
    const username = profile.value.username.trim();
    if (username === '') {
        toastStore.addToast('Le pseudo ne peut pas être vide.', 'error');
        return;
    }
    if (username.length > 20) {
        toastStore.addToast('Le pseudo ne doit pas dépasser 20 caractères.', 'error');
        return;
    }

    saving.value = true;
    try {
        const data = await profileService.updateProfile(authStore.token, {
            username,
            avatar_url: profile.value.avatar_url
        });

        profile.value = data;
        toastStore.addToast('Profil mis à jour avec succès !');
    } catch (err) {
        console.error('Error updating profile:', err);
        toastStore.addToast(err.message || 'Échec de la mise à jour du profil.', 'error');
    } finally {
        saving.value = false;
    }
}

async function fetchFriendsData() {
    try {
        friends.value = await friendService.getFriends(authStore.token);
        pendingRequests.value = await friendService.getPendingRequests(authStore.token);
    } catch (err) {
        console.error('Error fetching friends:', err);
        toastStore.addToast('Impossible de charger les données d\'amis.', 'error');
    }
}

async function searchUsers() {
    if (searchQuery.value.length < 3) {
        searchResults.value = [];
        return;
    }
    loading.value = true;
    try {
        searchResults.value = await friendService.searchUsers(searchQuery.value, authStore.token);
    } catch (err) {
        console.error('Error searching users:', err);
    } finally {
        loading.value = false;
    }
}

async function sendRequest(friendId) {
    try {
        await friendService.sendFriendRequest(friendId, authStore.token);
        toastStore.addToast('Demande d\'ami envoyée !');
        searchQuery.value = '';
        searchResults.value = [];
    } catch (err) {
        console.error('Error sending request:', err);
        toastStore.addToast('Déjà envoyé ou erreur.', 'error');
    }
}

async function acceptRequest(requestId) {
    try {
        await friendService.acceptRequest(requestId, authStore.token);
        await fetchFriendsData();
    } catch (err) {
        console.error('Error accepting request:', err);
    }
}

async function logout() {
    await authStore.signOut();
    window.location.href = '/login';
}
</script>

<template>
    <div class="page-container">
        <ParticleBackground />
        
        <main class="dashboard-container">
            <div class="dashboard-card">
                <div class="sidebar">
                    <div class="user-info">
                        <img :src="profile.avatar_url || 'https://via.placeholder.com/100'" alt="Avatar" class="avatar-large">
                        <h2 class="t-h2">{{ profile.username || 'Guest' }}</h2>
                        <p class="t-body-text color-text-muted">{{ user?.email }}</p>
                    </div>

                    <nav class="side-nav">
                        <button @click="activeTab = 'profile'" :class="['nav-item', { active: activeTab === 'profile' }]">
                            <i class="icon-user"></i> Mon Profil
                        </button>
                        <button @click="activeTab = 'friends'" :class="['nav-item', { active: activeTab === 'friends' }]">
                            <i class="icon-friends"></i> Amis
                            <span v-if="pendingRequests.length > 0" class="badge">{{ pendingRequests.length }}</span>
                        </button>
                        <router-link to="/" class="nav-item return-home">
                            <i class="icon-home"></i> Retour à l'accueil
                        </router-link>
                    </nav>

                    <button @click="logout" class="btn-ghost logout-btn">Déconnexion</button>
                </div>

                <div class="content-area">
                    <!-- PROFILE TAB -->
                    <div v-if="activeTab === 'profile'" class="tab-content">
                        <h1 class="t-h1 u-mb30">Paramètres du Compte</h1>
                        
                        <div class="form-group">
                            <label class="t-body-text">Nom d'utilisateur</label>
                            <input v-model="profile.username" type="text" class="input-field" placeholder="Choisis un pseudo" maxlength="20">
                            <p class="t-body-text-xs color-text-light u-mt10">{{ profile.username.length }}/20</p>
                        </div>

                        <div class="form-group">
                            <label class="t-body-text">URL de l'Avatar</label>
                            <input v-model="profile.avatar_url" type="text" class="input-field" placeholder="URL de l'image">
                            <p class="t-body-text-xs color-text-light u-mt10">Récupéré par défaut de ton compte Google.</p>
                        </div>

                        <button @click="updateProfile" class="btn-primary" :disabled="saving">
                            {{ saving ? 'Enregistrement...' : 'Enregistrer les modifications' }}
                        </button>
                    </div>

                    <!-- FRIENDS TAB -->
                    <div v-if="activeTab === 'friends'" class="tab-content">
                        <h1 class="t-h1 u-mb30">Social</h1>

                        <section class="search-section u-mb40">
                            <h3 class="t-h3 u-mb10">Ajouter des amis</h3>
                            <div class="search-bar">
                                <input v-model="searchQuery" @input="searchUsers" type="text" placeholder="Rechercher par pseudo..." class="input-field">
                            </div>
                            <div v-if="searchResults.length > 0" class="search-results card-list">
                                <div v-for="res in searchResults" :key="res.id" class="list-item">
                                    <img :src="res.avatar_url" class="avatar-sm">
                                    <span>{{ res.username }}</span>
                                    <button @click="sendRequest(res.id)" class="btn-primary btn-sm">Ajouter</button>
                                </div>
                            </div>
                        </section>

                        <section v-if="pendingRequests.length > 0" class="pending-section u-mb40">
                            <h3 class="t-h3 u-mb10">Demandes en attente</h3>
                            <div class="card-list">
                                <div v-for="req in pendingRequests" :key="req.id" class="list-item">
                                    <img :src="req.user.avatar_url" class="avatar-sm">
                                    <span>{{ req.user.username }}</span>
                                    <button @click="acceptRequest(req.id)" class="btn-primary btn-sm">Accepter</button>
                                </div>
                            </div>
                        </section>

                        <section class="friends-section">
                            <h3 class="t-h3 u-mb10">Tes Amis</h3>
                            <div v-if="friends.length > 0" class="card-list">
                                <div v-for="friend in friends" :key="friend.id" class="list-item">
                                    <img :src="friend.avatar_url" class="avatar-sm">
                                    <span>{{ friend.username }}</span>
                                    <div class="status-indicator online"></div>
                                    <button @click="friendToRemove = friend" class="btn-remove btn-sm">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <p v-else class="color-text-muted">Pas encore d'amis. Cherche des gens pour les ajouter !</p>
                        </section>

                        <!-- Modale de confirmation -->
                        <transition name="fade">
                            <div v-if="friendToRemove" class="modal-overlay" @click.self="friendToRemove = null">
                                <div class="modal">
                                    <p class="t-body-text">Supprimer <strong>{{ friendToRemove.username }}</strong> de tes amis ?</p>
                                    <div class="modal-actions">
                                        <button @click="friendToRemove = null" class="btn-ghost btn-sm">Annuler</button>
                                        <button @click="removeFriend" class="btn-danger btn-sm">Supprimer</button>
                                    </div>
                                </div>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<style lang="scss" scoped>
.dashboard-container {
    padding: $spacing-3xl;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.dashboard-card {
    background: $color-surface;
    backdrop-filter: blur($blur-lg);
    border: 1px solid $color-border;
    border-radius: 24px;
    display: flex;
    width: 100%;
    max-width: 1000px;
    height: 700px;
    overflow: hidden;
    box-shadow: $shadow-xl;
}

.sidebar {
    width: 300px;
    background: rgba(0, 0, 0, 0.2);
    border-right: 1px solid $color-border;
    padding: $spacing-xl;
    display: flex;
    flex-direction: column;
}

.user-info {
    text-align: center;
    margin-bottom: $spacing-3xl;
    
    .avatar-large {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 3px solid $color-accent;
        margin-bottom: $spacing-md;
        object-fit: cover;
    }
}

.side-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;

    .nav-item {
        background: transparent;
        border: none;
        color: $color-text;
        text-align: left;
        padding: $spacing-md $spacing-lg;
        border-radius: 12px;
        cursor: pointer;
        font-size: $font-size-base;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: background $duration-fast;

        &:hover {
            background: $color-surface-hover;
        }

        &.active {
            background: $color-primary-gradient;
            font-weight: 600;
        }

        .badge {
            background: $color-danger;
            font-size: $font-size-xs;
            padding: 2px 8px;
            border-radius: 10px;
        }
    }
}

.logout-btn {
    margin-top: auto;
}

.content-area {
    flex: 1;
    padding: $spacing-3xl;
    overflow-y: auto;
}

.form-group {
    margin-bottom: $spacing-xl;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    text-align: left;
}

.input-field {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid $color-border;
    border-radius: 12px;
    padding: $spacing-md;
    color: white;
    font-size: $font-size-base;
    
    &:focus {
        border-color: $color-accent;
        outline: none;
    }
}

.card-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
}

.list-item {
    background: $color-surface-hover;
    border: 1px solid $color-border;
    border-radius: 16px;
    padding: $spacing-md;
    display: flex;
    align-items: center;
    gap: $spacing-md;

    .avatar-sm {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
    }

    span {
        flex: 1;
        text-align: left;
    }

    .btn-sm {
        padding: $spacing-xs $spacing-md;
        font-size: $font-size-sm;
    }
}

.status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    &.online { background: $color-success; }
}

.color-text-muted { color: $color-text-muted; }
.color-text-light { color: $color-text-light; }


.btn-remove {
    background: transparent;
    border: 1px solid rgba(255, 80, 80, 0.3);
    color: rgba(255, 100, 100, 0.7);
    border-radius: 8px;
    padding: 6px 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: all 0.2s;

    &:hover {
        background: rgba(255, 80, 80, 0.15);
        color: #ff6464;
        border-color: rgba(255, 80, 80, 0.6);
    }
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal {
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: 16px;
    padding: $spacing-xl $spacing-3xl;
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;
    box-shadow: $shadow-xl;
    text-align: center;
}

.modal-actions {
    display: flex;
    gap: $spacing-md;
    justify-content: center;
}

.btn-danger {
    background: rgba(255, 80, 80, 0.2);
    border: 1px solid rgba(255, 80, 80, 0.4);
    color: #ff6464;
    border-radius: 50px;
    padding: $spacing-xs $spacing-lg;
    cursor: pointer;
    font-size: $font-size-sm;
    transition: all 0.2s;

    &:hover {
        background: rgba(255, 80, 80, 0.35);
    }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
