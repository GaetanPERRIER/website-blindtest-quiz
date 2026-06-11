<script setup>
import { usePlayerStore } from '@/stores/playerStore.js'
import { computed, ref, watchEffect, onMounted, onBeforeUnmount } from 'vue'
import InputAnswer from '@/components/Blindtest/Game/Playing/InputAnswer.vue'
import SoundVolume from './Utils/SoundVolume.vue'

const playerStore = usePlayerStore()
const room = computed(() => playerStore.room)
const musicToGuess = computed(() => playerStore.room.currentMusic)
const audioVolume = computed(() => playerStore.exponentialVolume)
const players = computed(() => playerStore.room.players)
const currentRound = computed(() => playerStore.room.round + 1)
const totalRounds = computed(() => playerStore.room.playlist?.length ?? playerStore.room.setting?.songCount ?? '?')
const playersAnswered = computed(() => players.value.filter(p => p.hasAnswered).length)

// Audio
const audioEl = ref(null)
const currentTime = ref(0)
const duration = ref(0)
const progressPercent = computed(() =>
  duration.value ? (currentTime.value / duration.value) * 100 : 0
)

watchEffect(() => {
  if (audioEl.value) audioEl.value.volume = audioVolume.value
})

function onTimeUpdate() {
  currentTime.value = audioEl.value?.currentTime ?? 0
}
function onLoadedMetadata() {
  duration.value = audioEl.value?.duration ?? 0
}

// Timer
const roundDuration = computed(() => {
  if (room.value.setting?.difficulty === 'easy') return 30
  if (room.value.setting?.difficulty === 'hard') return 15
  return 20
})
const timeLeft = ref(roundDuration.value)
let timerInterval = null

onMounted(() => {
  timeLeft.value = roundDuration.value
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) timeLeft.value--
    else clearInterval(timerInterval)
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(timerInterval)
})

const timerPercent = computed(() =>
  (timeLeft.value / roundDuration.value) * 100
)
const timerColor = computed(() => {
  if (timeLeft.value > roundDuration.value * 0.5) return '#FFBB33'
  if (timeLeft.value > roundDuration.value * 0.25) return '#FF8C00'
  return '#FF4444'
})

// Circonférence du cercle SVG
const radius = 28
const circumference = 2 * Math.PI * radius
const strokeDashoffset = computed(() =>
  circumference - (timerPercent.value / 100) * circumference
)
</script>

<template>
  <div class="guessing-screen">

    <!-- Audio caché -->
    <audio
      ref="audioEl"
      :src="musicToGuess.preview"
      autoplay
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
    />

    <!-- Header -->
    <div class="guessing-header">
      <div class="round-info">
        <span class="round-label">Round</span>
        <span class="round-count">{{ currentRound }} / {{ totalRounds }}</span>
      </div>
      <SoundVolume />
    </div>

    <!-- Zone centrale -->
    <div class="guessing-center">

      <!-- Timer circulaire -->
      <div class="timer-wrapper">
        <svg class="timer-svg" viewBox="0 0 72 72">
          <circle
            cx="36" cy="36" :r="radius"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            stroke-width="4"
          />
          <circle
            cx="36" cy="36" :r="radius"
            fill="none"
            :stroke="timerColor"
            stroke-width="4"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
            transform="rotate(-90 36 36)"
            style="transition: stroke-dashoffset 1s linear, stroke 0.5s ease"
          />
        </svg>
        <span class="timer-number" :style="{ color: timerColor }">{{ timeLeft }}</span>
      </div>

      <!-- Visualiseur audio animé -->
      <div class="visualizer">
        <span v-for="i in 7" :key="i" class="bar" :style="{ animationDelay: `${i * 0.1}s` }" />
      </div>

      <!-- Barre de progression audio -->
      <div class="audio-progress-wrapper">
        <div class="audio-progress-bar">
          <div class="audio-progress-fill" :style="{ width: progressPercent + '%' }" />
        </div>
      </div>

      <!-- Joueurs ayant répondu -->
      <div class="players-answered">
        <span class="dot" v-for="player in players" :key="player.socketId"
          :class="{ answered: player.hasAnswered }"
          :title="player.username"
        />
        <span class="players-answered-label">
          {{ playersAnswered }} / {{ players.length }} answered
        </span>
      </div>

    </div>

    <!-- Zone de saisie -->
    <div class="guessing-input-zone">
      <InputAnswer />
    </div>

  </div>
</template>

<style scoped lang="scss">
.guessing-screen {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 30px 40px 50px;
  position: relative;
  z-index: 1;
}

// Header
.guessing-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.round-info {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .round-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: 500;
  }

  .round-count {
    font-size: 22px;
    color: #fff;
    font-weight: 700;
  }
}

// Centre
.guessing-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

// Timer
.timer-wrapper {
  position: relative;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;

  .timer-svg {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .timer-number {
    font-size: 20px;
    font-weight: 700;
    position: relative;
    z-index: 1;
    transition: color 0.5s ease;
  }
}

// Visualiseur
.visualizer {
  display: flex;
  align-items: flex-end;
  gap: 5px;
  height: 40px;

  .bar {
    display: block;
    width: 5px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.7);
    animation: barBounce 1s ease-in-out infinite alternate;
    height: 10px;

    @keyframes barBounce {
      0%   { height: 6px; opacity: 0.4; }
      100% { height: 38px; opacity: 1; }
    }
  }
}

// Barre de progression audio
.audio-progress-wrapper {
  width: 320px;

  .audio-progress-bar {
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: rgba(255, 255, 255, 0.2);
    overflow: hidden;

    .audio-progress-fill {
      height: 100%;
      border-radius: 2px;
      background: $major-yellow-color;
      transition: width 0.5s linear;
    }
  }
}

// Joueurs
.players-answered {
  display: flex;
  align-items: center;
  gap: 8px;

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    border: 1.5px solid rgba(255, 255, 255, 0.4);
    transition: all 300ms $authenticMotion;

    &.answered {
      background: $major-yellow-color;
      border-color: $major-yellow-color;
      transform: scale(1.2);
    }
  }

  .players-answered-label {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.6);
    margin-left: 4px;
  }
}

// Input zone
.guessing-input-zone {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>