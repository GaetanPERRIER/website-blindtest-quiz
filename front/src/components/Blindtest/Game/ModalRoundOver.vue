<script setup>
import { usePlayerStore } from "@/stores/playerStore.js";
import { computed, ref, onMounted } from "vue";
import Player from "@/components/Blindtest/Room/Utils/Player.vue";

const playerStore = usePlayerStore();
const room = computed(() => playerStore.room);
const musicToGuess = computed(() => playerStore.room.currentMusic);

const currentRound = computed(() => room.value.round + 1);
const totalRounds = computed(() => room.value.playlist?.length ?? room.value.setting?.songCount ?? '?');

const playersOrdered = computed(() =>
  [...room.value.players].sort((a, b) => (b.roundScore ?? 0) - (a.roundScore ?? 0))
);

const playersWhoGuessed = computed(() =>
  playersOrdered.value.filter(p => p.titleGuessed)
);

const countdown = ref(5);
const progress = ref(100);

onMounted(() => {
    const timer = setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--;
            progress.value = (countdown.value / 5) * 100;
        } else {
            clearInterval(timer);
        }
    }, 1000);
});

function getPlayerIndex(socketId) {
    return room.value.players.findIndex(p => p.socketId === socketId);
}

function formatResponseTime(ms) {
  if (!ms) return null;
  return (ms / 1000).toFixed(1) + 's';
}

function getRoundScore(player) {
  return player.roundScore ?? player.lastRoundScore ?? 0;
}
</script>

<template>
  <div class="modal-round-over">
    <!-- Révélation de la chanson -->
    <div class="song-reveal-container">
        <div class="album-art-wrapper">
            <img :src="musicToGuess.album?.cover_xl" class="album-art-bg" />
            <img :src="musicToGuess.album?.cover_medium" class="album-art" />
        </div>
        <div class="song-info-reveal">
            <h2 class="song-title">{{ musicToGuess.title_short }}</h2>
            <p class="song-artist">{{ musicToGuess.artist?.name }}</p>
        </div>
    </div>

    <!-- Podium & Scores -->
    <div class="scores-container">
        <div v-if="playersWhoGuessed.length > 0" class="podium-mini">
            <div v-for="(player, index) in playersOrdered" :key="player.socketId" 
                 class="player-score-row" 
                 :class="{ 'is-winner': index === 0 && player.titleGuessed }"
                 :style="{ animationDelay: (0.5 + index * 0.1) + 's' }">
                
                <div class="rank-badge" :class="'rank-' + (index + 1)">
                    <template v-if="index === 0 && player.titleGuessed">🏆</template>
                    <template v-else>{{ index + 1 }}</template>
                </div>
                
                <Player :player="player" :playerOptions="false" :index="getPlayerIndex(player.socketId)" />
                
                <div class="round-stats">
                    <span v-if="player.titleGuessed" class="time-stat">{{ formatResponseTime(player.responseTime) }}</span>
                    <span class="score-stat" :class="{ 'has-score': getRoundScore(player) > 0 }">
                        +{{ getRoundScore(player) }}
                    </span>
                </div>
            </div>
        </div>
        
        <div v-else class="no-winner">
            <p>Nobody found the answer! 😔</p>
        </div>
    </div>

    <!-- Footer Progress -->
    <div class="modal-footer w100">
        <div class="round-progress-info u-flex u-justify-content-between u-mb10">
            <span class="round-number t-body-text">Round {{ currentRound }} / {{ totalRounds }}</span>
            <span class="next-round t-body-text">Next round in {{ countdown }}s</span>
        </div>
        <div class="progress-bar-container">
            <div class="progress-bar-fill" :style="{ width: progress + '%' }"></div>
        </div>
    </div>
  </div>
</template>

<style scoped lang="scss">

.modal-round-over {
  width: min(600px, 95vw);
  background: rgba(20, 20, 20, 0.7);
  backdrop-filter: blur(30px);
  border: 1px solid $color-border;
  border-radius: $radius-xl;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  box-shadow: $shadow-xl;
}

// Révélation de la chanson
.song-reveal-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
    animation: slide-down 0.6s $authenticMotion;

    .album-art-wrapper {
        position: relative;
        width: 180px;
        height: 180px;
        
        .album-art-bg {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: $radius-lg;
            filter: blur(20px);
            opacity: 0.6;
            transform: scale(1.1);
        }
        
        .album-art {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: $radius-lg;
            object-fit: cover;
            box-shadow: $shadow-lg;
            border: 2px solid $color-border;
            animation: reveal-art 1s $authenticMotion;
        }
    }

    .song-info-reveal {
        text-align: center;
        
        .song-title {
            font-size: $font-size-2xl;
            font-weight: 800;
            color: $color-white;
            margin: 0;
            animation: fade-in-up 0.6s $authenticMotion 0.2s both;
        }
        
        .song-artist {
            font-size: $font-size-lg;
            color: $color-accent;
            font-weight: 600;
            margin: 5px 0 0 0;
            animation: fade-in-up 0.6s $authenticMotion 0.3s both;
        }
    }
}

// Scores
.scores-container {
    width: 100%;
    
    .podium-mini {
        display: flex;
        flex-direction: column;
        gap: 12px;
    }
    
    .player-score-row {
        display: flex;
        align-items: center;
        gap: 15px;
        background: $color-surface;
        padding: 10px 20px;
        border-radius: $radius-md;
        border: 1px solid $color-border;
        animation: fade-in-right 0.5s $authenticMotion both;
        
        &.is-winner {
            background: rgba(255, 187, 51, 0.15);
            border-color: rgba(255, 187, 51, 0.3);
            transform: scale(1.02);
            box-shadow: 0 0 20px rgba(255, 187, 51, 0.1);
        }
        
        .rank-badge {
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: $font-size-xs;
            border-radius: $radius-full;
            background: $color-surface-hover;
            border: 1px solid $color-border;
            color: $color-text-muted;
            
            &.rank-1 { background: $color-accent; color: $color-black; }
            &.rank-2 { background: #E2E2E2; color: $color-black; }
            &.rank-3 { background: #CD7F32; color: $color-white; }
        }
        
        .round-stats {
            margin-left: auto;
            display: flex;
            align-items: center;
            gap: 15px;
            
            .time-stat {
                font-size: $font-size-xs;
                color: $color-text-light;
            }
            
            .score-stat {
                font-size: $font-size-base;
                font-weight: 800;
                color: $color-text-muted;
                min-width: 45px;
                text-align: right;
                
                &.has-score {
                    color: $color-success;
                }
            }
        }
    }
}

.no-winner {
    text-align: center;
    color: $color-text-muted;
    font-style: italic;
    padding: 20px;
}

// Footer
.modal-footer {
    .round-number { color: $color-text-muted; font-weight: 600; }
    .next-round { color: $color-accent; font-weight: 700; }
    
    .progress-bar-container {
        width: 100%;
        height: 6px;
        background: $color-surface;
        border-radius: 10px;
        overflow: hidden;
        
        .progress-bar-fill {
            height: 100%;
            background: $color-primary-gradient;
            transition: width 1s linear;
        }
    }
}

// Animations
@keyframes reveal-art {
    0% { transform: scale(0.8); filter: blur(20px); opacity: 0; }
    100% { transform: scale(1); filter: blur(0); opacity: 1; }
}

@keyframes slide-down {
    from { transform: translateY(-30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@keyframes fade-in-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@keyframes fade-in-right {
    from { transform: translateX(-20px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
</style>