<script setup>
import { usePlayerStore } from "@/stores/playerStore.js";
import { computed } from "vue";
import Player from "@/components/Blindtest/Room/Utils/Player.vue";

const playerStore = usePlayerStore();
const room = computed(() => playerStore.room);
const musicToGuess = computed(() => playerStore.room.currentMusic);

const currentRound = computed(() => room.value.round + 1);

const playersWhoGuessed = computed(() =>
  room.value.players
    .filter(p => p.titleGuessed)
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 3)
);

function formatResponseTime(ms) {
  if (!ms) return null;
  return (ms / 1000).toFixed(1) + 's';
}

function getRoundScore(player) {
  return player.roundScore ?? player.lastRoundScore ?? null;
}
</script>

<template>
  <div class="modal-round-over">

    <!-- Titre -->
    <div class="modal-header">
      <h2 class="t-color-white">ROUND {{ currentRound }} OVER</h2>
      <p class="song-reveal">
        <span class="song-label">The answer was:</span>
        <span class="song-title">{{ musicToGuess.title_short }}</span>
        <span class="song-separator">—</span>
        <span class="song-artist">{{ musicToGuess.artist?.name }}</span>
      </p>
    </div>

    <!-- Podium -->
    <div v-if="playersWhoGuessed.length > 0" class="podium-container">

      <!-- 2e place -->
      <div v-if="playersWhoGuessed[1]" class="podium-card podium-second" style="animation-delay: 0.1s">
        <div class="podium-rank">2</div>
        <Player :player="playersWhoGuessed[1]" :playerOptions="false" />
        <div class="podium-stats">
          <span v-if="formatResponseTime(playersWhoGuessed[1].responseTime)" class="stat-time">
            {{ formatResponseTime(playersWhoGuessed[1].responseTime) }}
          </span>
          <span v-if="getRoundScore(playersWhoGuessed[1])" class="stat-score">
            +{{ getRoundScore(playersWhoGuessed[1]) }} pts
          </span>
        </div>
      </div>

      <!-- 1ère place -->
      <div v-if="playersWhoGuessed[0]" class="podium-card podium-first" style="animation-delay: 0s">
        <div class="podium-rank">🏆</div>
        <Player :player="playersWhoGuessed[0]" :playerOptions="false" />
        <div class="podium-stats">
          <span v-if="formatResponseTime(playersWhoGuessed[0].responseTime)" class="stat-time">
            {{ formatResponseTime(playersWhoGuessed[0].responseTime) }}
          </span>
          <span v-if="getRoundScore(playersWhoGuessed[0])" class="stat-score">
            +{{ getRoundScore(playersWhoGuessed[0]) }} pts
          </span>
        </div>
      </div>

      <!-- 3e place -->
      <div v-if="playersWhoGuessed[2]" class="podium-card podium-third" style="animation-delay: 0.2s">
        <div class="podium-rank">3</div>
        <Player :player="playersWhoGuessed[2]" :playerOptions="false" />
        <div class="podium-stats">
          <span v-if="formatResponseTime(playersWhoGuessed[2].responseTime)" class="stat-time">
            {{ formatResponseTime(playersWhoGuessed[2].responseTime) }}
          </span>
          <span v-if="getRoundScore(playersWhoGuessed[2])" class="stat-score">
            +{{ getRoundScore(playersWhoGuessed[2]) }} pts
          </span>
        </div>
      </div>

    </div>

    <!-- Personne n'a trouvé -->
    <div v-else class="no-winner">
      <span class="no-winner-icon">😔</span>
      <p>Nobody got it this time!</p>
    </div>

  </div>
</template>

<style scoped lang="scss">
.modal-round-over {
  width: min(720px, 90vw);
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
}

// Header
.modal-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;

  h2 {
    font-size: 22px;
    font-weight: 800;
    letter-spacing: 1px;
    margin: 0;
  }

  .song-reveal {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
    font-size: 15px;

    .song-label {
      color: rgba(255, 255, 255, 0.55);
    }

    .song-title {
      color: #fff;
      font-weight: 600;
    }

    .song-separator {
      color: rgba(255, 255, 255, 0.35);
    }

    .song-artist {
      color: $major-yellow-color;
      font-weight: 600;
    }
  }
}

// Podium
.podium-container {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 16px;
  width: 100%;
}

.podium-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 18px 20px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  animation: cardAppear 0.5s $easeOutBack both;
  min-width: 140px;

  @keyframes cardAppear {
    from { opacity: 0; transform: translateY(20px) scale(0.9); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .podium-rank {
    font-size: 20px;
    font-weight: 800;
    color: #fff;
  }

  .podium-stats {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    .stat-time {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.55);
    }

    .stat-score {
      font-size: 14px;
      font-weight: 700;
      color: #fff;
    }
  }
}

.podium-first {
  background: rgba(255, 187, 51, 0.2);
  border-color: rgba(255, 187, 51, 0.4);
  padding-bottom: 28px;

  .podium-rank { color: $major-yellow-color; }
  .stat-score  { color: $major-yellow-color; }
}

.podium-second {
  background: rgba(255, 255, 255, 0.08);
}

.podium-third {
  background: rgba(205, 127, 50, 0.15);
  border-color: rgba(205, 127, 50, 0.3);
}

// Aucun gagnant
.no-winner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  .no-winner-icon { font-size: 36px; }

  p {
    font-size: 16px;
    color: rgba(255, 255, 255, 0.7);
  }
}
</style>