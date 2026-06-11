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
      <span>Réponse envoyée — en attente des autres joueurs</span>
    </div>
  </div>

  <!-- Formulaire de saisie -->
  <div v-else class="input-container">
    <input
      class="answer-input"
      v-model="userAnswer"
      type="text"
      placeholder="Saisir le nom de la musique..."
      @keydown.enter="CheckAnswer"
      autofocus
    />
    <button
      class="validate-btn"
      @click="CheckAnswer"
      :disabled="!userAnswer.trim()"
      :class="{ disabled: !userAnswer.trim() }"
    >
      Valider
    </button>
  </div>
</template>

<style scoped lang="scss">
.input-container {
  display: flex;
  gap: 10px;
  align-items: center;

  .answer-input {
    width: 420px;
    padding: 14px 22px;
    background: rgba(255, 255, 255, 0.12);
    border: 1.5px solid rgba(255, 255, 255, 0.25);
    border-radius: 50px;
    color: #fff;
    font-size: 16px;
    font-family: $font-base;
    backdrop-filter: blur(8px);
    transition: all 250ms $authenticMotion;

    &::placeholder {
      color: rgba(255, 255, 255, 0.45);
    }

    &:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.6);
      background: rgba(255, 255, 255, 0.18);
    }
  }

  .validate-btn {
    padding: 14px 28px;
    background: $major-yellow-color;
    border-radius: 50px;
    color: #1a1a1a;
    font-size: 15px;
    font-weight: 600;
    font-family: $font-base;
    cursor: pointer;
    transition: all 250ms $authenticMotion;
    white-space: nowrap;

    &:hover:not(.disabled) {
      background: darken($major-yellow-color, 8%);
      transform: scale(1.05);
    }

    &.disabled {
      opacity: 0.4;
      cursor: not-allowed;
      transform: none;
    }
  }
}

.answered-state {
  .answered-badge {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 28px;
    background: rgba(255, 255, 255, 0.1);
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    color: rgba(255, 255, 255, 0.85);
    font-size: 15px;
    backdrop-filter: blur(8px);

    .checkmark {
      font-size: 18px;
      color: $major-yellow-color;
      font-weight: 700;
    }
  }
}
</style>