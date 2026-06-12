<script setup>

import {usePlayerStore} from "@/stores/playerStore.js";
import {computed, ref} from "vue";
import socket from "@/utils/socket.js";

const playerStore = usePlayerStore();
const copied = ref(false);

const currentPlayer = computed(() =>
    playerStore.room.players.find(player => player.socketId === socket.id)
)

function CopyLink() {
    if (copied.value) return;
    
    const inviteUrl = `${window.location.origin}?roomId=${currentPlayer.value.roomId}`;
    navigator.clipboard.writeText(inviteUrl).then(() => {
        copied.value = true;
        setTimeout(() => {
            copied.value = false;
        }, 2000);
    }).catch(() => {});
}

</script>

<template>
    <button @click="CopyLink" class="invite-button t-body-text" :class="{ 'copied': copied }">
        <template v-if="!copied">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            Copy invite link
        </template>
        <template v-else>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            Copied!
        </template>
    </button>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings';

.invite-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background: $color-surface;
    color: $color-text;
    padding: 8px 20px;
    border-radius: 50px;
    border: 1px solid $color-border;
    cursor: pointer;
    font-size: $font-size-sm !important;
    transition: all $duration-normal $authenticMotion;

    &:hover {
        background: $color-surface-hover;
        border-color: $color-border-hover;
        transform: translateY(-2px);
    }

    &.copied {
        background: $color-success;
        border-color: transparent;
        color: $color-black;
    }
}

</style>