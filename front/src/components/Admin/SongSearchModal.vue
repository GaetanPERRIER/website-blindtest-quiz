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
            <header class="modal-header u-flex u-justify-content-between u-align-items-start">
                <div class="modal-heading">
                    <h2 class="t-title modal-title">Ajouter un morceau</h2>
                    <p class="modal-subtitle">{{ playlistName }}</p>
                </div>
                <button class="close-btn" aria-label="Fermer" title="Fermer" @click="$emit('close')">
                    <X :size="20" />
                </button>
            </header>

            <div class="search-wrapper">
                <Search :size="18" class="search-icon" />
                <input
                    ref="searchInput"
                    v-model="query"
                    class="search-input"
                    type="search"
                    placeholder="Rechercher un titre ou un artiste sur Spotify..."
                />
            </div>

            <div class="results">
                <div v-if="isSearching" class="state-message">
                    <div class="searching-indicator u-flex u-align-items-center u-gap10">
                        <div class="pulse-dot"></div>
                        <span>Recherche en cours…</span>
                    </div>
                </div>

                <div v-else-if="query.trim().length < 2" class="state-message">
                    <Music2 :size="40" class="state-icon" />
                    <p>Saisissez au moins 2 caractères pour lancer la recherche</p>
                </div>

                <div v-else-if="results.length === 0" class="state-message">
                    <p>Aucun résultat pour « {{ query.trim() }} »</p>
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
                            class="btn-primary btn-sm add-btn"
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
// Même overlay et même verre sombre que les modales de Backoffice.vue / ModalRoundOver
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
    max-width: 640px;
    max-height: 80vh;
    padding: $spacing-2xl;
    background: rgba(20, 20, 20, 0.7);
    backdrop-filter: blur(30px);
    border: 1px solid $color-border;
    border-radius: $radius-xl;
    box-shadow: $shadow-xl;
    overflow: hidden;
    animation: modal-pop $duration-normal $easeOutBack;
}

.modal-header {
    flex-shrink: 0;
    gap: $spacing-md;
}

.modal-heading {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
    min-width: 0;
}

.modal-title {
    font-size: $font-size-xl;
    color: $color-text;
}

.modal-subtitle {
    font-size: $font-size-base;
    font-weight: 600;
    color: $color-accent;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

// Bouton carré sombre, sur le modèle du bouton "Leave Room" du lobby
.close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: $radius-md;
    background: rgba($color-black, 0.4);
    border: 1px solid rgba($color-white, 0.1);
    color: $color-white;
    cursor: pointer;
    transition: all $duration-fast $authenticMotion;

    &:hover {
        background: $color-surface-hover;
        border-color: $color-border-hover;
        transform: scale(1.05);
    }
}

.search-wrapper {
    position: relative;
    flex-shrink: 0;
}

.search-icon {
    position: absolute;
    top: 50%;
    left: 20px;
    transform: translateY(-50%);
    color: $color-text-muted;
    pointer-events: none;
}

.search-input {
    width: 100%;
    background: $color-surface;
    padding: 12px 25px 12px 50px;
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

.results {
    flex: 1;
    min-height: 200px;
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
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: $spacing-md;
    height: 100%;
    min-height: 200px;
    text-align: center;
    color: $color-text-muted;
    font-size: $font-size-sm;
}

.state-icon {
    opacity: 0.4;
}

// Indicateur d'attente du lobby ("Waiting for host...")
.searching-indicator {
    background: rgba($color-white, 0.05);
    padding: $spacing-sm $spacing-lg;
    border-radius: $radius-full;
    border: 1px solid $color-border;

    .pulse-dot {
        width: 8px;
        height: 8px;
        background: $color-accent;
        border-radius: $radius-full;
        animation: pulse-dot 1.5s infinite;
    }
}

.result-list {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
}

.result-row {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-sm $spacing-md;
    background: rgba($color-white, 0.05);
    border: 1px solid transparent;
    border-radius: $radius-md;
    transition: all $duration-normal $authenticMotion;

    &:hover {
        background: $color-surface-hover;
        border-color: $color-border;
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
    font-size: $font-size-base;
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
    flex-shrink: 0;
    gap: $spacing-xs;
}

.added-badge {
    display: inline-flex;
    align-items: center;
    gap: $spacing-xs;
    flex-shrink: 0;
    padding: 6px 12px;
    border-radius: $radius-full;
    border: 1px solid rgba($color-success, 0.4);
    background: rgba($color-success, 0.12);
    color: $color-success;
    font-size: $font-size-xs;
    font-weight: 600;
    white-space: nowrap;
}

@keyframes modal-pop {
    from {
        opacity: 0;
        transform: translateY(-20px) scale(0.96);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes pulse-dot {
    0% { transform: scale(0.95); opacity: 0.5; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(0.95); opacity: 0.5; }
}

@media (max-width: 1000px) {
    .modal {
        max-height: 88vh;
        padding: $spacing-lg;
    }

    .track-artist span {
        display: none;
    }
}
</style>
