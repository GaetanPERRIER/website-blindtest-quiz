<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { Play, Pause } from 'lucide-vue-next'
import { usePlayerStore } from '@/stores/playerStore'

const props = defineProps({
    song: { type: Object, required: true },
    index: { type: Number, required: true },
    isPlaying: { type: Boolean, default: false }
})

const emit = defineEmits(['play', 'pause', 'ended'])

const playerStore = usePlayerStore()
const audioEl = ref(null)
const currentTime = ref(0)
const duration = ref(0)

const hasPreview = computed(() => !!props.song.preview_url)
const progressPercent = computed(() =>
    duration.value ? (currentTime.value / duration.value) * 100 : 0
)

watchEffect(() => {
    if (audioEl.value) {
        audioEl.value.volume = playerStore.exponentialVolume
    }
})

watch(() => props.isPlaying, (playing) => {
    if (!audioEl.value) return
    if (playing) {
        audioEl.value.play().catch(() => emit('pause'))
    } else {
        audioEl.value.pause()
    }
})

function togglePreview() {
    if (!hasPreview.value) return
    if (props.isPlaying) {
        emit('pause')
    } else {
        emit('play', props.song.id)
    }
}

function onTimeUpdate() {
    currentTime.value = audioEl.value?.currentTime ?? 0
}

function onLoadedMetadata() {
    duration.value = audioEl.value?.duration ?? 0
}

function onEnded() {
    currentTime.value = 0
    emit('ended')
}
</script>

<template>
    <div class="song-row" :class="{ playing: isPlaying }">
        <span class="track-number">{{ index + 1 }}</span>

        <div class="song-info">
            <div class="song-main u-flex u-align-items-center u-gap8">
                <div class="cover-wrapper">
                    <img
                        v-if="song.cover_url"
                        :src="song.cover_url"
                        :alt="song.title"
                        class="cover"
                    />
                    <div v-else class="cover cover-placeholder" />
                </div>

                <div class="song-details">
                    <h3 class="song-title">{{ song.title }}</h3>
                    <p class="song-artist">{{ song.artist }}</p>
                    <div v-if="isPlaying" class="progress-bar">
                        <div class="progress-fill" :style="{ width: `${progressPercent}%` }" />
                    </div>
                </div>
            </div>
        </div>

        <div class="song-actions u-flex u-align-items-center u-gap8">
            <span v-if="!hasPreview" class="no-preview-badge">Preview indisponible</span>
            <button
                class="play-btn"
                :class="{ playing: isPlaying }"
                :disabled="!hasPreview"
                :aria-label="isPlaying ? 'Pause' : 'Lire la preview'"
                @click="togglePreview"
            >
                <Pause v-if="isPlaying" :size="16" />
                <Play v-else :size="16" />
            </button>
        </div>

        <audio
            v-if="hasPreview"
            ref="audioEl"
            :src="song.preview_url"
            preload="none"
            @timeupdate="onTimeUpdate"
            @loadedmetadata="onLoadedMetadata"
            @ended="onEnded"
        />
    </div>
</template>

<style scoped lang="scss">
.song-row {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    padding: $spacing-xs $spacing-sm;
    border-radius: $radius-md;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    transition: background $duration-normal $authenticMotion;

    &.playing {
        background: $color-surface-hover;
    }

    &:hover:not(.playing) {
        background: rgba(255, 255, 255, 0.05);
    }
}

.track-number {
    flex-shrink: 0;
    width: 24px;
    text-align: center;
    font-size: $font-size-sm;
    color: $color-text-muted;
}

.song-info {
    flex: 1;
    min-width: 0;
}

.cover-wrapper {
    flex-shrink: 0;
}

.cover {
    width: 40px;
    height: 40px;
    border-radius: $radius-sm;
    object-fit: cover;
    border: 1px solid $color-border;

    &.cover-placeholder {
        background: $color-primary-gradient;
    }
}

.song-details {
    flex: 1;
    min-width: 0;
}

.song-title {
    font-size: $font-size-sm;
    font-weight: 500;
    color: $color-text;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.song-artist {
    font-size: $font-size-sm;
    color: $color-text-muted;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.progress-bar {
    margin-top: $spacing-xs;
    height: 3px;
    background: rgba(255, 255, 255, 0.15);
    border-radius: $radius-full;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: $color-accent;
    border-radius: $radius-full;
    transition: width 100ms linear;
}

.song-actions {
    flex-shrink: 0;
}

.no-preview-badge {
    font-size: $font-size-xs;
    color: $color-text-muted;
    padding: 2px 8px;
    border-radius: $radius-full;
    border: 1px solid $color-border;
    white-space: nowrap;
}

.play-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid $color-border;
    color: $color-text;
    cursor: pointer;
    transition: all $duration-normal $authenticMotion;
    flex-shrink: 0;

    &:hover:not(:disabled) {
        border-color: $color-accent;
        color: $color-accent;
    }

    &.playing {
        border-color: $color-accent;
        background: rgba(255, 187, 51, 0.15);
        color: $color-accent;
    }

    &:disabled {
        opacity: 0.35;
        cursor: not-allowed;
    }
}
</style>
