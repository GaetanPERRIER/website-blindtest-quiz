<script setup>
import { usePlayerStore } from '@/stores/playerStore.js'
import { computed } from 'vue'
import InputAnswer from '@/components/Blindtest/Game/Playing/InputAnswer.vue'
import ScaleSpawnAnimation from '@/components/Basics/ScaleSpawnAnimation.vue'
import SoundVolume from './Utils/SoundVolume.vue'

const playerStore = usePlayerStore()
const room = computed(() => playerStore.room)
const musicToGuess = computed(() => playerStore.room.currentMusic)
const audioVolume = computed(() => playerStore.exponentialVolume)

</script>

<template>
    <SoundVolume />

    <div class="musicToDisplay">
        <audio :src="musicToGuess.preview" controls autoplay :volume="audioVolume"></audio>
    </div>

    <InputAnswer />
</template>

<style scoped lang="scss">

.musicToDisplay {
    audio {
        display: none;
    }
}

</style>
