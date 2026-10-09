<script setup>
import { computed } from 'vue'
import { Music2 } from 'lucide-vue-next'
import SongPreviewRow from './SongPreviewRow.vue'

const props = defineProps({
    playlist: { type: Object, default: null },
    isLoading: { type: Boolean, default: false },
    error: { type: String, default: null },
    currentlyPlayingId: { type: [Number, String, null], default: null }
})

defineEmits(['play', 'pause', 'ended'])

const songs = computed(() => props.playlist?.songs ?? [])
const previewCount = computed(() => songs.value.filter(s => s.preview_url).length)
</script>

<template>
    <div class="playlist-detail-panel">
        <div v-if="!playlist && !isLoading && !error" class="empty-state">
            <Music2 :size="48" class="empty-icon" />
            <p>Sélectionnez une playlist</p>
        </div>

        <div v-else-if="error" class="error-state">
            <p>{{ error }}</p>
        </div>

        <template v-else-if="isLoading">
            <div class="detail-skeleton">
                <div class="skeleton-header">
                    <div class="skeleton-cover-lg" />
                    <div class="skeleton-meta">
                        <div class="skeleton-line skeleton-line--title" />
                        <div class="skeleton-line skeleton-line--sub" />
                    </div>
                </div>
                <div class="skeleton-songs">
                    <div v-for="n in 5" :key="n" class="skeleton-song-row">
                        <div class="skeleton-line" style="width: 24px" />
                        <div class="skeleton-cover-sm" />
                        <div class="skeleton-line" style="flex: 1" />
                    </div>
                </div>
            </div>
        </template>

        <template v-else-if="playlist">
            <div class="detail-header">
                <img
                    v-if="playlist.cover_url"
                    :src="playlist.cover_url"
                    :alt="playlist.name"
                    class="detail-cover"
                />
                <div v-else class="detail-cover detail-cover-placeholder">
                    <Music2 :size="40" />
                </div>

                <div class="detail-meta">
                    <h2 class="detail-title">{{ playlist.name }}</h2>
                    <div class="detail-stats u-flex u-gap8 u-align-items-center">
                        <span class="stat-badge">{{ songs.length }} morceau{{ songs.length !== 1 ? 'x' : '' }}</span>
                        <span class="stat-badge">{{ previewCount }} preview{{ previewCount !== 1 ? 's' : '' }} disponible{{ previewCount !== 1 ? 's' : '' }}</span>
                    </div>
                </div>
            </div>

            <div v-if="songs.length === 0" class="empty-songs">
                <p>Cette playlist ne contient aucun morceau</p>
            </div>

            <div v-else class="songs-list">
                <SongPreviewRow
                    v-for="(song, index) in songs"
                    :key="song.id"
                    :song="song"
                    :index="index"
                    :is-playing="currentlyPlayingId === song.id"
                    @play="$emit('play', $event)"
                    @pause="$emit('pause')"
                    @ended="$emit('ended')"
                />
            </div>
        </template>
    </div>
</template>

<style scoped lang="scss">
.playlist-detail-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
}

.empty-state,
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    gap: $spacing-lg;
    color: $color-text-muted;
    text-align: center;
}

.empty-icon {
    opacity: 0.4;
}

.error-state {
    color: $color-danger;
}

.detail-header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: $spacing-lg;
    margin-bottom: $spacing-lg;
    padding-bottom: $spacing-lg;
    border-bottom: 1px solid $color-border;
}

.detail-cover {
    width: 100px;
    height: 100px;
    border-radius: $radius-lg;
    object-fit: cover;
    box-shadow: $shadow-lg;
    border: 2px solid $color-border;
    flex-shrink: 0;

    &.detail-cover-placeholder {
        display: flex;
        align-items: center;
        justify-content: center;
        background: $color-primary-gradient;
        color: $color-black;
    }
}

.detail-meta {
    flex: 1;
    min-width: 0;
}

.detail-title {
    font-size: $font-size-xl;
    font-weight: 600;
    color: $color-text;
    margin-bottom: $spacing-sm;
    word-break: break-word;
}

.detail-stats {
    flex-wrap: wrap;
}

.stat-badge {
    font-size: $font-size-xs;
    color: $color-text-muted;
    padding: 4px 12px;
    border-radius: $radius-full;
    border: 1px solid $color-border;
    background: $color-surface;
}

.songs-list {
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

.empty-songs {
    color: $color-text-muted;
    text-align: center;
    padding: $spacing-xl;
}

.detail-skeleton {
    display: flex;
    flex-direction: column;
    gap: $spacing-xl;
    height: 100%;
}

.skeleton-header {
    display: flex;
    gap: $spacing-xl;
    align-items: center;
}

.skeleton-cover-lg {
    width: 100px;
    height: 100px;
    border-radius: $radius-lg;
    flex-shrink: 0;
    background: linear-gradient(90deg, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

.skeleton-meta {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $spacing-md;
}

.skeleton-songs {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
}

.skeleton-song-row {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-sm;
}

.skeleton-cover-sm {
    width: 48px;
    height: 48px;
    border-radius: $radius-sm;
    background: linear-gradient(90deg, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

.skeleton-line {
    height: 12px;
    border-radius: $radius-sm;
    background: linear-gradient(90deg, rgba(255,255,255,0.08) 25%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;

    &--title { width: 60%; height: 20px; }
    &--sub { width: 35%; }
}

@keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
</style>
