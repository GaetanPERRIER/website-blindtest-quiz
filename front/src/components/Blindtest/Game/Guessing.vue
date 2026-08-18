<script setup>
import { usePlayerStore } from '@/stores/playerStore.js'
import { computed, ref, watch, watchEffect, onMounted, onBeforeUnmount } from 'vue'
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

// Fondu d'entree/sortie : le volume applique est audioVolume * fadeMultiplier,
// fadeMultiplier passe de 0 a 1 au demarrage de l'extrait puis de 1 a 0 en fin de round.
const FADE_IN_MS = 600
const FADE_OUT_MS = 1500
const fadeMultiplier = ref(0)
let fadeFrame = null

function applyVolume() {
  if (audioEl.value) audioEl.value.volume = audioVolume.value * fadeMultiplier.value
}

watchEffect(applyVolume)

function fadeTo(target, durationMs) {
  if (fadeFrame) cancelAnimationFrame(fadeFrame)
  const start = fadeMultiplier.value
  const startTime = performance.now()

  function step(now) {
    const progress = Math.min((now - startTime) / durationMs, 1)
    fadeMultiplier.value = start + (target - start) * progress
    if (progress < 1) fadeFrame = requestAnimationFrame(step)
  }
  fadeFrame = requestAnimationFrame(step)
}

function onPlay() {
  fadeTo(1, FADE_IN_MS)
}

function onTimeUpdate() {
  currentTime.value = audioEl.value?.currentTime ?? 0
}
function onLoadedMetadata() {
  duration.value = audioEl.value?.duration ?? 0
}

// Timer
const roundDuration = ref(30)
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
  if (fadeFrame) cancelAnimationFrame(fadeFrame)
})

// Fondu de sortie : demarre quand il reste peu de temps avant la fin du round
watch(timeLeft, (value) => {
  if (value === 2) fadeTo(0, FADE_OUT_MS)
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

function getPlayerInitials(username) {
    if (!username) return '?';
    return username.substring(0, 2).toUpperCase();
}

function getPlayerColor(index) {
    const colors = ['#FF6B6B', '#4ECDC4', '#A29BFE', '#FFEAA7', '#FD79A8', '#55EFC4'];
    return colors[index % colors.length];
}
</script>

<template>
  <div class="guessing-screen">

    <!-- Audio caché -->
    <audio
      ref="audioEl"
      :src="musicToGuess.preview"
      autoplay
      @play="onPlay"
      @timeupdate="onTimeUpdate"
      @loadedmetadata="onLoadedMetadata"
    />

    <!-- Header -->
    <div class="guessing-header">
      <div class="round-info">
        <span class="round-label">Round</span>
        <span class="round-count">{{ currentRound }} / {{ totalRounds }}</span>
      </div>
      
      <div class="category-info u-flex-direction-column u-align-items-center">
        <span class="category-label">Category</span>
        <span class="category-name">{{ room.setting?.category?.title || 'Unknown' }}</span>
      </div>

      <SoundVolume />
    </div>

    <!-- Zone centrale -->
    <div class="guessing-center">

      <!-- Timer circulaire -->
      <div class="timer-wrapper" :class="{ 'pulse-critical': timeLeft <= 5 }">
        <svg class="timer-svg" viewBox="0 0 72 72">
          <circle
            cx="36" cy="36" :r="radius"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            stroke-width="3"
          />
          <circle
            cx="36" cy="36" :r="radius"
            fill="none"
            :stroke="timerColor"
            stroke-width="3"
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
        <span v-for="i in 15" :key="i" class="bar" :style="{ animationDelay: `${i * 0.07}s` }" />
      </div>

      <!-- Joueurs ayant répondu -->
      <div class="players-zone">
        <div v-for="(player, index) in players" :key="player.socketId" class="player-avatar-wrapper" :title="player.username">
            <div class="player-avatar" :style="{ backgroundColor: getPlayerColor(index) }">
                {{ getPlayerInitials(player.username) }}
                <div v-if="player.hasAnswered" class="check-badge">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                </div>
            </div>
        </div>
      </div>
      
      <div class="players-answered-label t-body-text">
        {{ playersAnswered }} / {{ players.length }} answered
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

  .category-info {
    .category-label {
        font-size: $font-size-xs;
        color: $color-text-muted;
        text-transform: uppercase;
        letter-spacing: 2px;
        font-weight: 600;
    }
    .category-name {
        font-size: $font-size-xl;
        font-weight: 800;
        color: $color-accent;
        background: $color-primary-gradient;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
  }
}

.round-info {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .round-label {
    font-size: $font-size-xs;
    color: $color-text-muted;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: 600;
  }

  .round-count {
    font-size: $font-size-xl;
    color: $color-white;
    font-weight: 700;
  }
}

// Centre
.guessing-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

// Timer
.timer-wrapper {
  position: relative;
  width: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform $duration-normal $authenticMotion;

  &.pulse-critical {
    animation: critical-pulse 1s infinite alternate $authenticMotion;
  }

  .timer-svg {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .timer-number {
    font-size: 48px;
    font-weight: 800;
    position: relative;
    z-index: 1;
    transition: color 0.5s ease;
  }
}

@keyframes critical-pulse {
    from { transform: scale(1); filter: drop-shadow(0 0 0 rgba(255, 68, 68, 0)); }
    to { transform: scale(1.1); filter: drop-shadow(0 0 20px rgba(255, 68, 68, 0.4)); }
}

// Visualiseur
.visualizer {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 60px;

  .bar {
    display: block;
    width: 6px;
    border-radius: 4px;
    background: $color-primary-gradient;
    animation: barBounce 0.8s ease-in-out infinite alternate;
    height: 15px;
    box-shadow: 0 0 10px rgba(255, 110, 110, 0.3);

    @keyframes barBounce {
      0%   { height: 10px; opacity: 0.4; transform: scaleY(1); }
      100% { height: 55px; opacity: 1; transform: scaleY(1.2); }
    }
  }
}

// Joueurs
.players-zone {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  max-width: 500px;

  .player-avatar-wrapper {
    position: relative;
    
    .player-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: $font-size-sm;
        color: $color-black;
        border: 2px solid rgba(255, 255, 255, 0.2);
        box-shadow: $shadow-sm;
        transition: transform $duration-normal $authenticMotion;

        .check-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: $color-success;
            color: $color-black;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: $shadow-md;
            animation: check-pop 0.4s $authenticMotion;
        }
    }
  }
}

@keyframes check-pop {
    0% { transform: scale(0); }
    70% { transform: scale(1.3); }
    100% { transform: scale(1); }
}

.players-answered-label {
    font-size: $font-size-sm;
    color: $color-text-muted;
    background: $color-surface;
    padding: 6px 16px;
    border-radius: 20px;
    border: 1px solid $color-border;
}

// Input zone
.guessing-input-zone {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>