<script setup>
import { ref, watch } from 'vue';
import {usePlayerStore} from "@/stores/playerStore.js";

const playerStore = usePlayerStore()
const volume = ref(playerStore.volume)

// Conversion exponentielle à chaque changement
watch(volume, (newVal) => {
    playerStore.setVolume(newVal)
})

</script>

<template>

<div class="volume-controller-container">
    <div class="img-container">
        <img src="/imgs/VolumeController/volume-core.png" alt="" class="volume-core">
        <img src="/imgs/VolumeController/volume-first.png" alt="" class="volume-first">
        <img src="/imgs/VolumeController/volume-second.png" alt="" class="volume-second">
        <img src="/imgs/VolumeController/volume-third.png" alt="" class="volume-third">
    </div>
    <input type="range" class="volume-bar" min="0" max="1" step="0.01" v-model="volume">
</div>

</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

.volume-controller-container {
    display: flex;
    position: fixed;
    z-index: 10000;
    left: 0px;
    bottom: 0px;
    padding: 10px;
    gap: 5px;

    &:hover {
        .volume-bar {
            opacity: 1;
        }

        .img-container {
            transform: rotate(-10deg) scale(1.05);
        }
    }
    
    .img-container {
        position: relative;
        width: 50px;
        cursor: pointer;
        transition: all 250ms $authenticMotion;

        .volume-core {
            width: 100%;
        }

        .volume-first, .volume-second, .volume-third {
            margin-left: 5px;
            position: absolute;
            bottom: 0;
            right: 0;
            width: 100%;
        }
    }

    .volume-bar {
        opacity: 0;
        width: 100px;
    }

}

</style>