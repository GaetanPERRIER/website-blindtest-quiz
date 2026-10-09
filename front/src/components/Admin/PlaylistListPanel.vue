<script setup>
import { computed } from 'vue'
import { RefreshCw, Plus } from 'lucide-vue-next'
import PlaylistRow from './PlaylistRow.vue'

const props = defineProps({
    playlists: { type: Array, default: () => [] },
    selectedPlaylistId: { type: [Number, String, null], default: null },
    searchQuery: { type: String, default: '' },
    isLoading: { type: Boolean, default: false },
    isSyncing: { type: Boolean, default: false },
    syncMessage: { type: String, default: null }
})

defineEmits(['select', 'update:searchQuery', 'sync', 'create'])

const filteredPlaylists = computed(() => {
    const query = props.searchQuery.trim().toLowerCase()
    if (!query) return props.playlists
    return props.playlists.filter(p =>
        p.name?.toLowerCase().includes(query)
    )
})
</script>

<template>
    <div class="playlist-list-panel">
        <div class="panel-header">
            <div class="header-top u-flex u-justify-content-between u-align-items-center">
                <h2 class="panel-title">Playlists</h2>
                <span class="count-badge">{{ playlists.length }} playlist{{ playlists.length !== 1 ? 's' : '' }}</span>
            </div>
            <div class="header-actions u-flex u-align-items-center u-gap8">
                <button class="btn-primary btn-sm" @click="$emit('create')">
                    <Plus :size="16" />
                    Nouvelle playlist
                </button>
                <button
                    class="sync-btn"
                    :disabled="isSyncing"
                    @click="$emit('sync')"
                >
                    <RefreshCw :size="16" :class="{ spinning: isSyncing }" />
                    {{ isSyncing ? 'Sync…' : 'Sync Spotify' }}
                </button>
                <span v-if="syncMessage" class="sync-message">{{ syncMessage }}</span>
            </div>
            <input
                class="search-input"
                type="search"
                placeholder="Rechercher une playlist..."
                :value="searchQuery"
                @input="$emit('update:searchQuery', $event.target.value)"
            />
        </div>

        <div class="panel-content">
            <div v-if="isLoading" class="skeleton-list">
                <div v-for="n in 4" :key="n" class="skeleton-row">
                    <div class="skeleton-cover" />
                    <div class="skeleton-text">
                        <div class="skeleton-line skeleton-line--title" />
                        <div class="skeleton-line skeleton-line--sub" />
                    </div>
                </div>
            </div>

            <div v-else-if="filteredPlaylists.length === 0" class="empty-state">
                <p v-if="searchQuery">Aucun résultat pour « {{ searchQuery }} »</p>
                <p v-else>Aucune playlist — cliquez sur Sync pour importer depuis Spotify</p>
            </div>

            <div v-else class="playlist-list">
                <PlaylistRow
                    v-for="playlist in filteredPlaylists"
                    :key="playlist.id"
                    :playlist="playlist"
                    :selected="selectedPlaylistId === playlist.id"
                    @select="$emit('select', $event)"
                />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.playlist-list-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.panel-header {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
    margin-bottom: $spacing-md;
}

// Libellé de section du lobby ("Tracks count")
.panel-title {
    font-size: $font-size-xs;
    font-weight: 700;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 1.5px;
}

.header-actions {
    flex-wrap: wrap;
}

.sync-message {
    font-size: $font-size-xs;
    font-weight: 600;
    color: $color-accent;
}

// Bouton pilule du lobby ("Copy invite link")
.sync-btn {
    display: inline-flex;
    align-items: center;
    gap: $spacing-sm;
    padding: 11px $spacing-lg;
    border-radius: $radius-full;
    border: 1px solid $color-border;
    background: $color-surface;
    color: $color-text;
    font-size: $font-size-sm;
    font-weight: 600;
    line-height: $line-height-tight;
    cursor: pointer;
    transition: all $duration-normal $authenticMotion;

    &:hover:not(:disabled) {
        background: $color-surface-hover;
        border-color: $color-border-hover;
        transform: translateY(-2px);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .spinning {
        animation: spin 1s linear infinite;
    }
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.count-badge {
    font-size: $font-size-xs;
    color: $color-text-muted;
    padding: 4px 12px;
    border-radius: $radius-full;
    border: 1px solid $color-border;
    background: $color-surface;
}

// Barre de recherche des catégories du lobby
.search-input {
    width: 100%;
    background: $color-surface;
    padding: 12px 25px;
    border-radius: $radius-full;
    font-size: $font-size-base;
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
}

.panel-content {
    flex: 1;
    overflow-y: auto;
    padding-right: 4px;

    scrollbar-width: thin;
    scrollbar-color: $color-border transparent;

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: $color-border;
        border-radius: 10px;
    }
}

.playlist-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
}

.empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 120px;
    text-align: center;
    color: $color-text-muted;
    font-size: $font-size-sm;
    padding: $spacing-xl;
}

.skeleton-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
}

.skeleton-row {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-sm;
}

.skeleton-cover {
    width: 52px;
    height: 52px;
    border-radius: $radius-md;
    background: linear-gradient(90deg, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

.skeleton-text {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
}

.skeleton-line {
    height: 12px;
    border-radius: $radius-sm;
    background: linear-gradient(90deg, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;

    &--title { width: 70%; height: 14px; }
    &--sub { width: 40%; }
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
</style>
