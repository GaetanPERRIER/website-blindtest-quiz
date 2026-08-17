<script setup>
import { ChevronRight, Music2 } from 'lucide-vue-next'

defineProps({
    playlist: { type: Object, required: true },
    selected: { type: Boolean, default: false }
})

defineEmits(['select'])
</script>

<template>
    <div
        class="playlist-row"
        :class="{ selected }"
        role="button"
        tabindex="0"
        @click="$emit('select', playlist.id)"
        @keydown.enter="$emit('select', playlist.id)"
    >
        <div class="cover-wrapper">
            <img
                v-if="playlist.cover_url"
                :src="playlist.cover_url"
                :alt="playlist.name"
                class="cover"
            />
            <div v-else class="cover cover-placeholder">
                <Music2 :size="24" />
            </div>
        </div>

        <div class="playlist-info">
            <h2 class="playlist-name">{{ playlist.name }}</h2>
            <span class="song-count">{{ playlist.song_count }} morceau{{ playlist.song_count !== 1 ? 'x' : '' }}</span>
        </div>

        <button class="chevron-btn" aria-hidden="true" tabindex="-1">
            <ChevronRight :size="20" />
        </button>
    </div>
</template>

<style scoped lang="scss">
.playlist-row {
    display: flex;
    align-items: center;
    gap: $spacing-md;
    padding: $spacing-sm;
    border-radius: $radius-md;
    border: 2px solid transparent;
    cursor: pointer;
    transition: all $duration-normal $authenticMotion;

    &:hover {
        background: $color-surface-hover;
    }

    &.selected {
        background: $color-surface-active;
        border-color: $color-accent;
    }
}

.cover-wrapper {
    flex-shrink: 0;
}

.cover {
    width: 52px;
    height: 52px;
    border-radius: $radius-md;
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

.playlist-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
}

.playlist-name {
    font-size: $font-size-sm;
    font-weight: 600;
    color: $color-text;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.song-count {
    font-size: $font-size-sm;
    color: $color-text-muted;
}

.chevron-btn {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-text-muted;
    transition: color $duration-normal $authenticMotion;

    .playlist-row:hover &,
    .playlist-row.selected & {
        color: $color-text;
    }
}
</style>
