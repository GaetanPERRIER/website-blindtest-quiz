<script setup>
import SoundVolume from '@/components/Blindtest/Game/Utils/SoundVolume.vue'
import PlaylistListPanel from '@/components/Admin/PlaylistListPanel.vue'
import PlaylistDetailPanel from '@/components/Admin/PlaylistDetailPanel.vue'
import SongSearchModal from '@/components/Admin/SongSearchModal.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useToastStore } from '@/stores/toastStore'
import { musicService } from '@/services/music.service'

const authStore = useAuthStore()
const toastStore = useToastStore()

const playlists = ref([])
const selectedPlaylist = ref(null)
const selectedPlaylistId = ref(null)
const searchQuery = ref('')
const currentlyPlayingId = ref(null)

const isLoadingPlaylists = ref(false)
const isLoadingDetail = ref(false)
const isSyncing = ref(false)
const detailError = ref(null)
const syncMessage = ref(null)

const isCreateModalOpen = ref(false)
const newPlaylistName = ref('')
const isCreatingPlaylist = ref(false)

const isSongSearchOpen = ref(false)
const trackResults = ref([])
const isSearchingTracks = ref(false)
const addingTrackId = ref(null)
const removingSongId = ref(null)

// Confirmation partagée par la suppression d'une playlist et celle d'un morceau
const confirmDialog = ref(null)

const existingTrackIds = computed(() =>
    (selectedPlaylist.value?.songs ?? []).map(song => song.spotify_track_id)
)

onMounted(() => {
    listPlaylists()
})

watch(selectedPlaylistId, () => {
    currentlyPlayingId.value = null
})

async function listPlaylists() {
    isLoadingPlaylists.value = true
    try {
        playlists.value = await musicService.listPlaylists()
    } catch (error) {
        console.error('Failed to load playlists:', error)
        toastStore.addToast('Impossible de charger les playlists.', 'error')
    } finally {
        isLoadingPlaylists.value = false
    }
}

async function selectPlaylist(id) {
    selectedPlaylistId.value = id
    selectedPlaylist.value = null
    isLoadingDetail.value = true
    await loadPlaylistDetails(id)
    isLoadingDetail.value = false
}

// Rechargement du detail sans vider le panneau : utilise apres un ajout/retrait de morceau
async function loadPlaylistDetails(id) {
    detailError.value = null
    try {
        selectedPlaylist.value = await musicService.getPlaylistDetails(id)
    } catch (error) {
        console.error('Failed to load playlist details:', error)
        detailError.value = 'Impossible de charger la playlist'
    }
}

async function syncPlaylists() {
    isSyncing.value = true
    syncMessage.value = null

    try {
        const result = await musicService.syncPlaylists(authStore.token)
        await listPlaylists()
        syncMessage.value = `${result.playlistsSynced ?? 0} playlist(s) synchronisée(s)`
    } catch (error) {
        console.error('Failed to sync playlists:', error)
        syncMessage.value = 'Échec de la synchronisation'
    } finally {
        isSyncing.value = false
        setTimeout(() => { syncMessage.value = null }, 4000)
    }
}

function openCreateModal() {
    newPlaylistName.value = ''
    isCreateModalOpen.value = true
}

async function createPlaylist() {
    const name = newPlaylistName.value.trim()
    if (!name) {
        toastStore.addToast('Le nom de la playlist ne peut pas être vide.', 'error')
        return
    }

    isCreatingPlaylist.value = true
    try {
        const playlist = await musicService.createPlaylist(name, authStore.token)
        isCreateModalOpen.value = false
        await listPlaylists()
        await selectPlaylist(playlist.id)
        toastStore.addToast('Playlist créée.')
    } catch (error) {
        console.error('Failed to create playlist:', error)
        toastStore.addToast(error.message || 'Échec de la création de la playlist.', 'error')
    } finally {
        isCreatingPlaylist.value = false
    }
}

function askDeletePlaylist() {
    const playlist = selectedPlaylist.value
    if (!playlist) return

    confirmDialog.value = {
        message: `Supprimer la playlist « ${playlist.name} » ? Elle sera aussi retirée de la bibliothèque Spotify.`,
        confirmLabel: 'Supprimer',
        onConfirm: () => deletePlaylist(playlist.id)
    }
}

async function deletePlaylist(playlistId) {
    try {
        await musicService.deletePlaylist(playlistId, authStore.token)
        selectedPlaylist.value = null
        selectedPlaylistId.value = null
        await listPlaylists()
        toastStore.addToast('Playlist supprimée.')
    } catch (error) {
        console.error('Failed to delete playlist:', error)
        toastStore.addToast(error.message || 'Échec de la suppression de la playlist.', 'error')
    }
}

function openSongSearch() {
    trackResults.value = []
    isSongSearchOpen.value = true
}

async function searchTracks(query) {
    if (!query) {
        trackResults.value = []
        isSearchingTracks.value = false
        return
    }

    isSearchingTracks.value = true
    try {
        trackResults.value = await musicService.searchTracks(query, authStore.token)
    } catch (error) {
        console.error('Failed to search tracks:', error)
        trackResults.value = []
        toastStore.addToast(error.message || 'Échec de la recherche Spotify.', 'error')
    } finally {
        isSearchingTracks.value = false
    }
}

async function addSong(track) {
    if (!selectedPlaylistId.value) return

    addingTrackId.value = track.spotify_track_id
    try {
        await musicService.addSong(selectedPlaylistId.value, track.spotify_track_id, authStore.token)
        await loadPlaylistDetails(selectedPlaylistId.value)
        await listPlaylists()
        toastStore.addToast(`« ${track.title} » ajouté à la playlist.`)
    } catch (error) {
        console.error('Failed to add song:', error)
        toastStore.addToast(error.message || 'Échec de l\'ajout du morceau.', 'error')
    } finally {
        addingTrackId.value = null
    }
}

function askRemoveSong(song) {
    confirmDialog.value = {
        message: `Retirer « ${song.title} » de la playlist ?`,
        confirmLabel: 'Retirer',
        onConfirm: () => removeSong(song)
    }
}

async function removeSong(song) {
    if (!selectedPlaylistId.value) return

    removingSongId.value = song.id
    try {
        await musicService.removeSong(selectedPlaylistId.value, song.id, authStore.token)
        if (currentlyPlayingId.value === song.id) {
            currentlyPlayingId.value = null
        }
        await loadPlaylistDetails(selectedPlaylistId.value)
        await listPlaylists()
        toastStore.addToast('Morceau retiré de la playlist.')
    } catch (error) {
        console.error('Failed to remove song:', error)
        toastStore.addToast(error.message || 'Échec du retrait du morceau.', 'error')
    } finally {
        removingSongId.value = null
    }
}

async function runConfirmedAction() {
    const action = confirmDialog.value?.onConfirm
    confirmDialog.value = null
    if (action) await action()
}

function onPlay(songId) {
    currentlyPlayingId.value = songId
}

function onPause() {
    currentlyPlayingId.value = null
}

function onEnded() {
    currentlyPlayingId.value = null
}
</script>

<template>
    <div class="page-container">
        <header class="backoffice-header">
            <h1 class="page-title">Administration</h1>
        </header>

        <main class="backoffice">
            <section class="panel panel-list">
                <PlaylistListPanel
                    :playlists="playlists"
                    :selected-playlist-id="selectedPlaylistId"
                    v-model:search-query="searchQuery"
                    :is-loading="isLoadingPlaylists"
                    :is-syncing="isSyncing"
                    :sync-message="syncMessage"
                    @select="selectPlaylist"
                    @sync="syncPlaylists"
                    @create="openCreateModal"
                />
            </section>

            <section class="panel panel-detail">
                <PlaylistDetailPanel
                    :playlist="selectedPlaylist"
                    :is-loading="isLoadingDetail"
                    :error="detailError"
                    :currently-playing-id="currentlyPlayingId"
                    :removing-song-id="removingSongId"
                    @play="onPlay"
                    @pause="onPause"
                    @ended="onEnded"
                    @add-song="openSongSearch"
                    @remove-song="askRemoveSong"
                    @delete-playlist="askDeletePlaylist"
                />
            </section>
        </main>

        <SoundVolume class="sound-volume" />

        <!-- Recherche Spotify pour ajouter un morceau -->
        <transition name="fade">
            <SongSearchModal
                v-if="isSongSearchOpen"
                :playlist-name="selectedPlaylist?.name ?? ''"
                :results="trackResults"
                :is-searching="isSearchingTracks"
                :adding-track-id="addingTrackId"
                :existing-track-ids="existingTrackIds"
                @search="searchTracks"
                @add="addSong"
                @close="isSongSearchOpen = false"
            />
        </transition>

        <!-- Creation d'une playlist -->
        <transition name="fade">
            <div v-if="isCreateModalOpen" class="modal-overlay" @click.self="isCreateModalOpen = false">
                <div class="modal">
                    <h2 class="modal-title">Nouvelle playlist</h2>
                    <input
                        v-model="newPlaylistName"
                        class="modal-input"
                        type="text"
                        placeholder="Nom de la playlist"
                        :disabled="isCreatingPlaylist"
                        @keydown.enter="createPlaylist"
                    />
                    <div class="modal-actions">
                        <button
                            class="btn-ghost btn-sm"
                            :disabled="isCreatingPlaylist"
                            @click="isCreateModalOpen = false"
                        >
                            Annuler
                        </button>
                        <button
                            class="btn-secondary btn-sm"
                            :disabled="isCreatingPlaylist"
                            @click="createPlaylist"
                        >
                            {{ isCreatingPlaylist ? 'Création…' : 'Créer' }}
                        </button>
                    </div>
                </div>
            </div>
        </transition>

        <!-- Confirmation de suppression (playlist ou morceau) -->
        <transition name="fade">
            <div v-if="confirmDialog" class="modal-overlay" @click.self="confirmDialog = null">
                <div class="modal">
                    <p class="t-body-text">{{ confirmDialog.message }}</p>
                    <div class="modal-actions">
                        <button class="btn-ghost btn-sm" @click="confirmDialog = null">Annuler</button>
                        <button class="btn-danger btn-sm" @click="runConfirmedAction">
                            {{ confirmDialog.confirmLabel }}
                        </button>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style lang="scss" scoped>
.page-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    padding: 100px $spacing-2xl 72px;
    box-sizing: border-box;
}

.backoffice-header {
    flex-shrink: 0;
    margin-bottom: $spacing-lg;
    padding-left: 80px;
}

.page-title {
    font-size: $font-size-xl;
    font-weight: 600;
    color: $color-text;
}

.backoffice {
    display: flex;
    flex: 1;
    gap: $spacing-xl;
    min-height: 0;
    height: calc(100vh - 180px);
}

.panel {
    background: $color-surface;
    backdrop-filter: blur($blur-md);
    border: 1px solid $color-border;
    border-radius: $radius-xl;
    padding: $spacing-xl;
    overflow: hidden;
}

.panel-list {
    width: 35%;
    flex-shrink: 0;
}

.panel-detail {
    flex: 1;
    min-width: 0;
    height: 100%;
}

.sound-volume {
    position: fixed;
    bottom: $spacing-lg;
    right: $spacing-lg;
    z-index: 10;
}

.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-lg;
    z-index: 1000;
}

.modal {
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;
    width: 100%;
    max-width: 420px;
    padding: $spacing-xl $spacing-3xl;
    background: lighten($color-black, 6%);
    border: 1px solid $color-border;
    border-radius: 16px;
    box-shadow: $shadow-xl;
    text-align: center;
}

.modal-title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $color-text;
}

.modal-input {
    width: 100%;
    background: $color-surface;
    padding: 10px 16px;
    border-radius: $radius-full;
    font-size: $font-size-sm;
    border: 1px solid $color-border;
    color: $color-text;
    transition: all $duration-normal $authenticMotion;

    &:focus {
        border-color: $color-accent;
        background: $color-surface-hover;
        outline: none;
    }

    &::placeholder {
        color: $color-text-muted;
    }

    &:disabled {
        opacity: 0.5;
    }
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

@media (max-width: 1000px) {
    .page-container {
        padding: 92px $spacing-lg 72px;
    }

    .backoffice-header {
        padding-left: 0;
    }

    .page-title {
        font-size: $font-size-lg;
    }

    .backoffice {
        flex-direction: column;
        height: auto;
    }

    .panel-list {
        width: 100%;
        height: 38vh;
    }

    .panel-detail {
        flex: 1;
        min-height: 42vh;
    }
}
</style>
