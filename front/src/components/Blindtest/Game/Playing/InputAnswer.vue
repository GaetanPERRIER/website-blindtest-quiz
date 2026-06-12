<script setup>
import socket from "@/utils/socket.js";
import { computed, ref } from "vue";
import { usePlayerStore } from "@/stores/playerStore.js";

const playerStore = usePlayerStore();
const room = computed(() => playerStore.room);
const currentPlayer = computed(() =>
  playerStore.room.players.find(player => player.socketId === socket.id)
);
const hasAnswered = computed(() => currentPlayer.value?.hasAnswered ?? false);

let userAnswer = ref("");

function CheckAnswer() {
  if (!userAnswer.value.trim() || hasAnswered.value) return;
  socket.emit("checkAnswer", room.value.id, currentPlayer.value.socketId, userAnswer.value);
  userAnswer.value = "";
}
</script>

<template>
  <!-- Réponse déjà envoyée -->
  <div v-if="hasAnswered" class="answered-state">
    <div class="answered-badge">
      <span class="checkmark">✓</span>
      <span>Answer sent — waiting for other players</span>
    </div>
  </div>

  <!-- Formulaire de saisie -->
  <div v-else class="input-container">
    <input
      class="answer-input"
      v-model="userAnswer"
      type="text"
      placeholder="Type the song title..."
      @keydown.enter="CheckAnswer"
      autofocus
    />
    <button
      class="validate-btn"
      @click="CheckAnswer"
      :disabled="!userAnswer.trim()"
      :class="{ disabled: !userAnswer.trim() }"
    >
      Guess
    </button>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings';

.input-container {
  display: flex;
  gap: 12px;
  align-items: center;
  width: 100%;
  max-width: 600px;

  .answer-input {
    flex: 1;
    padding: 16px 25px;
    background: $color-surface;
    border: 1px solid $color-border;
    border-radius: 50px;
    color: $color-white;
    font-size: $font-size-base;
    backdrop-filter: blur(10px);
    transition: all $duration-normal $authenticMotion;

    &::placeholder {
      color: $color-text-muted;
    }

    &:focus {
      outline: none;
      border-color: $color-accent;
      background: $color-surface-hover;
      box-shadow: 0 0 15px rgba(255, 187, 51, 0.2);
    }
  }

  .validate-btn {
    padding: 16px 35px;
    background: $color-primary-gradient;
    border-radius: 50px;
    color: $color-white;
    font-size: $font-size-base;
    font-weight: 700;
    cursor: pointer;
    transition: all $duration-normal $authenticMotion;
    border: none;
    box-shadow: $shadow-md;

    &:hover:not(.disabled) {
      transform: translateY(-2px);
      box-shadow: $shadow-lg;
    }

    &.disabled {
      opacity: 0.4;
      cursor: not-allowed;
      filter: grayscale(1);
    }
  }
}

.answered-state {
  .answered-badge {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 35px;
    background: $color-surface;
    border: 1px solid $color-success;
    border-radius: 50px;
    color: $color-success;
    font-size: $font-size-base;
    font-weight: 600;
    backdrop-filter: blur(10px);

    .checkmark {
      font-size: 20px;
      font-weight: 800;
    }
  }
}
</style>