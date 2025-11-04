<script setup>
import socket from "@/utils/socket.js";
import { computed, ref, watch } from "vue";
import { usePlayerStore } from "@/stores/playerStore.js";

const playerStore = usePlayerStore();

const room = computed(() => playerStore.room);
const currentPlayer = computed(() =>
    playerStore.room.players.find(player => player.socketId === socket.id)
);

const titleAnswer = ref("");
const artistAnswer = ref("");

const isTitleLocked = computed(() => Boolean(currentPlayer.value?.titleGuessed));
const isArtistLocked = computed(() => Boolean(currentPlayer.value?.artistGuessed));

const canSubmit = computed(() => {
    if (!room.value.id || !currentPlayer.value) {
        return false;
    }

    const titleCandidate = titleAnswer.value.trim();
    const artistCandidate = artistAnswer.value.trim();

    const canSubmitTitle = !isTitleLocked.value && titleCandidate.length > 0;
    const canSubmitArtist = !isArtistLocked.value && artistCandidate.length > 0;

    if (isTitleLocked.value && isArtistLocked.value) {
        return false;
    }

    return canSubmitTitle || canSubmitArtist;
});

const submitAnswer = () => {
    if (!canSubmit.value || !room.value.id || !currentPlayer.value) {
        return;
    }

    const payload = {
        title: isTitleLocked.value ? "" : titleAnswer.value.trim(),
        artist: isArtistLocked.value ? "" : artistAnswer.value.trim()
    };

    if (!payload.title && !payload.artist) {
        return;
    }

    socket.emit("checkAnswer", room.value.id, currentPlayer.value.socketId, payload);
};

watch(
    () => currentPlayer.value?.titleGuessed,
    (guessed) => {
        if (guessed) {
            titleAnswer.value = "";
        }
    }
);

watch(
    () => currentPlayer.value?.artistGuessed,
    (guessed) => {
        if (guessed) {
            artistAnswer.value = "";
        }
    }
);

</script>

<template>
    <div class="input-container">
        <div class="fields">
            <div class="field">
                <label class="field-label t-caption t-color-white">Titre</label>
                <input
                    class="t-color-white t-body-text"
                    v-model="titleAnswer"
                    type="text"
                    placeholder="Saisir le titre..."
                    :disabled="isTitleLocked"
                    @keydown.enter.prevent="submitAnswer"
                >
                <p v-if="isTitleLocked" class="field-status t-caption">Titre validé ✅</p>
            </div>
            <div class="field">
                <label class="field-label t-caption t-color-white">Artiste</label>
                <input
                    class="t-color-white t-body-text"
                    v-model="artistAnswer"
                    type="text"
                    placeholder="Saisir l'artiste..."
                    :disabled="isArtistLocked"
                    @keydown.enter.prevent="submitAnswer"
                >
                <p v-if="isArtistLocked" class="field-status t-caption">Artiste validé ✅</p>
            </div>
        </div>

        <button
            class="submit-button t-body-text t-color-white"
            :disabled="!canSubmit"
            @click="submitAnswer"
        >
            Valider
        </button>

        <p class="helper-text t-caption t-color-white">
            Astuce : vous pouvez valider même si un seul champ est rempli.
        </p>
    </div>
</template>

<style scoped lang="scss">

.input-container {
    width: 100%;
    max-width: 680px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 16px;

    .fields {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
    }

    .field {
        flex: 1 1 280px;
        display: flex;
        flex-direction: column;
        gap: 6px;

        input {
            padding: 12px 20px;
            background-color: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 200ms $authenticMotion;
            border-radius: 12px;
            backdrop-filter: blur(4px);

            &:focus {
                outline: none;
                border: 1px solid rgba(255, 255, 255, 0.5);
                background-color: rgba(255, 255, 255, 0.12);
            }

            &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
        }

        .field-status {
            color: rgba(255, 255, 255, 0.8);
        }
    }

    .submit-button {
        align-self: center;
        padding: 12px 36px;
        background-color: $major-yellow-color;
        border-radius: 999px;
        border: none;
        cursor: pointer;
        transition: all 200ms $authenticMotion;
        font-weight: 600;

        &:hover:not(:disabled) {
            background-color: darken($major-yellow-color, 10%);
            transform: scale(1.05);
        }

        &:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }
    }

    .helper-text {
        text-align: center;
        color: rgba(255, 255, 255, 0.75);
    }
}

@media (max-width: 600px) {
    .input-container {
        .fields {
            flex-direction: column;
        }
    }
}

</style>