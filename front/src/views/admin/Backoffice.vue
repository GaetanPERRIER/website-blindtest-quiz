<script setup>
import SoundVolume from '@/components/Blindtest/Game/Utils/SoundVolume.vue'
import PlaylistListPanel from '@/components/Admin/PlaylistListPanel.vue'
import PlaylistDetailPanel from '@/components/Admin/PlaylistDetailPanel.vue'
import { ref, onMounted, watch } from 'vue'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

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

onMounted(() => {
    listPlaylists()
})

watch(selectedPlaylistId, () => {
    currentlyPlayingId.value = null
})

async function listPlaylists() {
    isLoadingPlaylists.value = true
    try {
        const response = await fetch(`${API_URL}/api/music/list-playlists`)
        if (!response.ok) {
            throw new Error(`Statut de réponse : ${response.status}`)
        }
        playlists.value = await response.json()
    } catch (error) {
        console.error('Failed to load playlists:', error)
    } finally {
        isLoadingPlaylists.value = false
    }
}

async function selectPlaylist(id) {
    selectedPlaylistId.value = id
    selectedPlaylist.value = null
    detailError.value = null
    isLoadingDetail.value = true

    try {
        const response = await fetch(`${API_URL}/api/music/get-playlist-details/${id}`)
        if (!response.ok) {
            throw new Error(`Statut de réponse : ${response.status}`)
        }
        selectedPlaylist.value = await response.json()
    } catch (error) {
        console.error('Failed to load playlist details:', error)
        detailError.value = 'Impossible de charger la playlist'
    } finally {
        isLoadingDetail.value = false
    }
}

async function syncPlaylists() {
    isSyncing.value = true
    syncMessage.value = null

    try {
        const response = await fetch(`${API_URL}/api/music/sync-playlists`)
        if (!response.ok) {
            throw new Error(`Statut de réponse : ${response.status}`)
        }
        const result = await response.json()
        await listPlaylists()
        syncMessage.value = `${result.playlistsSynced ?? 0} playlist(s) synchronisée(s)`
        setTimeout(() => { syncMessage.value = null }, 4000)
    } catch (error) {
        console.error('Failed to sync playlists:', error)
        syncMessage.value = 'Échec de la synchronisation'
        setTimeout(() => { syncMessage.value = null }, 4000)
    } finally {
        isSyncing.value = false
    }
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
                />
            </section>

            <section class="panel panel-detail">
                <PlaylistDetailPanel
                    :playlist="selectedPlaylist"
                    :is-loading="isLoadingDetail"
                    :error="detailError"
                    :currently-playing-id="currentlyPlayingId"
                    @play="onPlay"
                    @pause="onPause"
                    @ended="onEnded"
                />
            </section>
        </main>

        <SoundVolume class="sound-volume" />
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
