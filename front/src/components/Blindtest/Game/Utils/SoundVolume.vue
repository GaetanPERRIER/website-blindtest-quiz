<script setup>
import { ref, watch, computed } from 'vue';
import { usePlayerStore } from "@/stores/playerStore.js";

const playerStore = usePlayerStore()
const volume = ref(playerStore.volume)

watch(volume, (newVal) => {
  playerStore.setVolume(newVal)
})

const firstVisible  = computed(() => volume.value > 0.05)
const secondVisible = computed(() => volume.value > 0.4)
const thirdVisible  = computed(() => volume.value > 0.72)
</script>

<template>
  <div class="volume-controller-container">
    <div class="img-container">
      <img src="/imgs/VolumeController/volume-core.png"   alt="" class="volume-core">
      <img src="/imgs/VolumeController/volume-first.png"  alt="" class="volume-first"
        :style="{ opacity: firstVisible ? 1 : 0 }" />
      <img src="/imgs/VolumeController/volume-second.png" alt="" class="volume-second"
        :style="{ opacity: secondVisible ? 1 : 0 }" />
      <img src="/imgs/VolumeController/volume-third.png"  alt="" class="volume-third"
        :style="{ opacity: thirdVisible ? 1 : 0 }" />
    </div>
    <input
      type="range"
      class="volume-bar"
      min="0" max="1" step="0.01"
      v-model="volume"
      :style="{ '--val': volume }"
      aria-label="Volume"
    />
  </div>
</template>

<style scoped lang="scss">
.volume-controller-container {
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    .volume-bar { opacity: 1; width: 90px; }
    .img-container { transform: rotate(-10deg) scale(1.05); }
  }

  .img-container {
    position: relative;
    width: 36px;
    cursor: pointer;
    transition: transform 250ms $authenticMotion;

    img {
      width: 100%;
      &.volume-first, &.volume-second, &.volume-third {
        position: absolute;
        bottom: 0; right: 0;
        margin-left: 5px;
        transition: opacity 200ms $authenticMotion;
      }
    }
  }

  .volume-bar {
    -webkit-appearance: none;
    appearance: none;
    height: 4px;
    border-radius: 2px;
    width: 0;
    opacity: 0;
    cursor: pointer;
    transition: opacity 250ms $authenticMotion, width 300ms $authenticMotion;
    background: linear-gradient(
      to right,
      $major-yellow-color calc(var(--val) * 100%),
      rgba(255, 255, 255, 0.25) 0%
    );

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #fff;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    }

    &::-moz-range-thumb {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #fff;
      cursor: pointer;
      border: none;
    }
  }
}
</style>