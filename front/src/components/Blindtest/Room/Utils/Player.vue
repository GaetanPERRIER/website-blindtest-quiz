<script setup>

import socket from "@/utils/socket.js";
import {usePlayerStore} from "@/stores/playerStore.js";
import {computed} from "vue";

const playerStore = usePlayerStore();
const room = computed(() => playerStore.room);
const currentPlayer = computed(() =>
    playerStore.room.players.find(player => player.socketId === socket.id)
)

const props = defineProps({
    player : Object,
    playerOptions : {
        type : Boolean,
        default : true
    },
    playerStat : {
        type: Boolean,
        default : false
    },
    index: {
        type: Number,
        default: 0
    }
})

const playerInitials = computed(() => {
    if (!props.player.username) return '?';
    return props.player.username.substring(0, 2).toUpperCase();
});

const playerColor = computed(() => {
    const colors = ['#FF6B6B', '#4ECDC4', '#A29BFE', '#FFEAA7', '#FD79A8', '#55EFC4'];
    return colors[props.index % colors.length];
});

function EjectAPlayer() {
    if (currentPlayer.value.host && !props.player.host){
        const roomId = room.value.id;
        const socketId = props.player.socketId;
        socket.emit("ejectPlayer", roomId, socketId);
    }
}

</script>

<template>
    <div class="player u-flex w100 u-align-items-center u-justify-content-between" :class="{ 'is-local': player.socketId === socket.id }">
        <div class="u-flex u-align-items-center u-gap12">
            <div class="avatar-circle" :style="{ backgroundColor: playerColor }">
                {{ playerInitials }}
                <div v-if="player.host" class="host-badge" title="Host">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z" />
                    </svg>
                </div>
            </div>
            <div class="player-info u-flex-direction-column">
                <span class="player-name t-body-text">{{ player.username }}</span>
                <span v-if="playerStat" class="player-score t-body-text">{{ player.score }} pts</span>
            </div>
        </div>
        
        <div class="player-actions" v-if="playerOptions">
            <button v-if="currentPlayer.host && !player.host" @click="EjectAPlayer" class="eject-btn" title="Eject player">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        </div>

        <div v-if="playerStat && player.titleGuessed" class="guessed-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        </div>
    </div>
</template>

<style scoped lang="scss">

@import '@/assets/styles/settings/settings';

.player {
    padding: $spacing-sm;
    border-radius: $radius-md;
    transition: background-color $duration-fast $authenticMotion;

    &.is-local {
        background-color: $color-surface;
    }

    .avatar-circle {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: $radius-full;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        font-size: $font-size-sm;
        color: $color-black;
        border: 2px solid $color-border;

        .host-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: $color-accent;
            color: $color-black;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: $shadow-sm;
        }
    }

    .player-info {
        display: flex;
        flex-direction: column;

        .player-name {
            font-size: $font-size-base;
            font-weight: 500;
            color: $color-text;
        }

        .player-score {
            font-size: $font-size-xs;
            color: $color-text-muted;
        }
    }

    .eject-btn {
        background: $color-surface;
        border: 1px solid $color-border;
        color: $color-text-light;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all $duration-fast $authenticMotion;

        &:hover {
            background: $color-danger;
            color: $color-white;
            border-color: transparent;
        }
    }

    .guessed-badge {
        color: $color-success;
        animation: bounce-in $duration-normal $authenticMotion;
    }
}

@keyframes bounce-in {
    0% { transform: scale(0); }
    70% { transform: scale(1.2); }
    100% { transform: scale(1); }
}

</style>