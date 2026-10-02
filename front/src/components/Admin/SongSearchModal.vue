<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { Search, Plus, Check, X, Music2 } from 'lucide-vue-next'

const props = defineProps({
    playlistName: { type: String, default: '' },
    results: { type: Array, default: () => [] },
    isSearching: { type: Boolean, default: false },
    addingTrackId: { type: [String, null], default: null },
    existingTrackIds: { type: Array, default: () => [] }
})

const emit = defineEmits(['search', 'add', 'close'])

const query = ref('')
const searchInput = ref(null)
let debounceTimer = null

watch(query, (value) => {
    clearTimeout(debounceTimer)
    const trimmed = value.trim()

    if (trimmed.length < 2) {
        emit('search', '')
        return
    }

    debounceTimer = setTimeout(() => emit('search', trimmed), 400)
})

onMounted(() => searchInput.value?.focus())

onBeforeUnmount(() => clearTimeout(debounceTimer))

function isAlreadyAdded(track) {
    return props.existingTrackIds.includes(track.spotify_track_id)
}
</script>

<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal">
            <header class="modal-header u-flex u-justify-content-between u-align-items-center">
                <div>
                    <h2 class="modal-title">Ajouter un morceau</h2>
                    <p class="modal-subtitle">{{ playlistName }}</p>
                </div>
                <button class="close-btn" aria-label="Fermer" @click="$emit('close')">
                    <X :size="20" />
                </button>
            </header>

            <div class="search-wrapper">
                <Search :size="16" class="search-icon" />
                <input
                    ref="searchInput"
                    v-model="query"
                    class="search-input"
                    type="search"
                    placeholder="Rechercher un titre ou un artiste sur Spotify..."
                />
            </div>

            <div class="results">
                <div v-if="isSearching" class="state-message">Recherche en cours…</div>

                <div v-else-if="query.trim().length < 2" class="state-message">
                    Saisissez au moins 2 caractères pour lancer la recherche
                </div>

                <div v-else-if="results.length === 0" class="state-message">
                    Aucun résultat pour « {{ query.trim() }} »
                </div>

                <div v-else class="result-list">
                    <div v-for="track in results" :key="track.spotify_track_id" class="result-row">
                        <img
                            v-if="track.cover_url"
                            :src="track.cover_url"
                            :alt="track.title"
                            class="cover"
                        />
                        <div v-else class="cover cover-placeholder">
                            <Music2 :size="18" />
                        </div>

                        <div class="track-info">
                            <h3 class="track-title">{{ track.title }}</h3>
                            <p class="track-artist">{{ track.artist }}<span v-if="track.album"> · {{ track.album }}</span></p>
                        </div>

                        <span v-if="isAlreadyAdded(track)" class="added-badge">
                            <Check :size="14" /> Déjà ajouté
                        </span>
                        <button
                            v-else
                            class="add-btn"
                            :disabled="addingTrackId !== null"
                            :aria-label="`Ajouter ${track.title}`"
                            @click="$emit('add', track)"
                        >
                            <Plus :size="16" />
                            {{ addingTrackId === track.spotify_track_id ? 'Ajout…' : 'Ajouter' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
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
    gap: $spacing-lg;
    width: 100%;
    max-width: 620px;
    max-height: 80vh;
    padding: $spacing-xl;
    background: lighten($color-black, 6%);
    border: 1px solid $color-border;
    border-radius: 16px;
    box-shadow: $shadow-xl;
    overflow: hidden;
}

.modal-header {
    flex-shrink: 0;
    gap: $spacing-md;
}

.modal-title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $color-text;
}

.modal-subtitle {
    font-size: $font-size-sm;
    color: $color-text-muted;
}

.close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 1px solid $color-border;
    color: $color-text-muted;
    cursor: pointer;
    transition: all $duration-normal $authenticMotion;

    &:hover {
        color: $color-text;
        border-color: $color-border-hover;
        background: $color-surface-hover;
    }
}

.search-wrapper {
    position: relative;
    flex-shrink: 0;
}

.search-icon {
    position: absolute;
    top: 50%;
    left: 14px;
    transform: translateY(-50%);
    color: $color-text-muted;
    pointer-events: none;
}

.search-input {
    width: 100%;
    background: $color-surface;
    padding: 10px 16px 10px 38px;
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
}

.results {
    flex: 1;
    min-height: 180px;
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

.state-message {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    min-height: 180px;
    text-align: center;
    color: $color-text-muted;
    font-size: $font-size-sm;
}

.result-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
}

.result-row {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-md;
    transition: background $duration-normal $authenticMotion;

    &:hover {
        background: $color-surface-hover;
    }
}

.cover {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: $radius-sm;
    object-fit: cover;
    border: 1px solid $color-border;

    &.cover-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        background: $color-primary-gradient;
        color: $color-black;
    }
}

.track-info {
    flex: 1;
    min-width: 0;
}

.track-title {
    font-size: $font-size-sm;
    font-weight: 500;
    color: $color-text;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.track-artist {
    font-size: $font-size-sm;
    color: $color-text-muted;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.add-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    padding: 4px 12px;
    border-radius: $radius-full;
    border: 1px solid $color-border;
    color: $color-text;
    font-size: $font-size-xs;
    cursor: pointer;
    transition: all $duration-normal $authenticMotion;

    &:hover:not(:disabled) {
        border-color: $color-accent;
        color: $color-accent;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
}

.added-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    padding: 4px 12px;
    border-radius: $radius-full;
    border: 1px solid $color-border;
    color: $color-text-muted;
    font-size: $font-size-xs;
    white-space: nowrap;
}

@media (max-width: 1000px) {
    .modal {
        max-height: 88vh;
        padding: $spacing-lg;
    }
}
</style>
