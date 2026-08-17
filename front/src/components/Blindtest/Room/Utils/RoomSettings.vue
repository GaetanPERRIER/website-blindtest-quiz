<script setup>
import socket from "@/utils/socket.js";
import { useRouter } from "vue-router";
import { usePlayerStore} from "@/stores/playerStore.js";
import { computed, onMounted, ref, watch} from "vue";
import PlayerList from "@/components/Blindtest/Room/Utils/PlayerList.vue";

const playerStore = usePlayerStore()
const router = useRouter()
const room = computed(() => playerStore.room);
const currentPlayer = computed(() =>
    playerStore.room.players.find(player => player.socketId === socket.id)
)
const songCount = computed({
    get: () => playerStore.room.setting.songCount,
    set: (value) => socket.emit("selectSongCount", room.value.id, value)
});


function setSongCount(event) {
    socket.emit("selectSongCount", room.value.id, event.target.value);
}

function leaveRoom() {
    if (room.value.id) {
        socket.emit('leaveRoom', room.value.id);
        playerStore.resetRoom();
        router.push('/');
    }
}


onMounted(() => {
    socket.off("categorySelected")
    socket.on('categorySelected', (newCategory) => {
        playerStore.setCategory(newCategory)
    })

    socket.off("songCountSelected")
    socket.on('songCountSelected', (newSongCount) => {
        playerStore.setSongCount(newSongCount)
    })

    socket.off("gameStarted")
    socket.on('gameStarted', (room) => {
        playerStore.startGame(room)
    })
})


</script>

<template>
    <div class="room-settings-container h100 w35" v-if="currentPlayer">
        <div class="room-settings u-flex u-flex-direction-column u-gap25 h100 w100">
            <div class="settings-header u-flex u-justify-content-between u-align-items-start w100">
                <div class="u-flex u-flex-direction-column u-gap5">
                    <h2 class="t-title t-color-white">Lobby</h2>
                    <p class="t-body-text-sm t-color-text-muted">Configure your session</p>
                </div>
                <button @click="leaveRoom" class="leave-button" title="Leave Room">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                </button>
            </div>

            <div class="players-section u-flex-grow-1 u-flex u-flex-direction-column u-gap10 w100">
                <div class="player-list-wrapper">
                    <PlayerList/>
                </div>
            </div>

            <div v-if="currentPlayer.host" class="mixer-control settings-card u-flex u-flex-direction-column u-gap15">
                <div class="u-flex u-justify-content-between u-align-items-center">
                    <span class="setting-label">Tracks count</span>
                    <span class="track-count-badge">{{ songCount }}</span>
                </div>
                <div class="slider-container">
                    <input 
                        type="range" 
                        min="1" 
                        max="20" 
                        step="1" 
                        v-model="songCount" 
                        class="track-count-slider"
                    >
                    <div class="slider-marks">
                        <span>1</span>
                        <span>10</span>
                        <span>20</span>
                    </div>
                </div>
            </div>

            <div class="w100 u-flex u-justify-content-center u-align-items-center u-pt10">
                <button v-if="currentPlayer.host" @click="socket.emit('startGame', room.id);" class="btn-primary start-button">
                    Start Blindtest
                </button>
                <div v-else class="waiting-indicator u-flex u-align-items-center u-gap10">
                    <div class="pulse-dot"></div>
                    <p class="waiting-message t-body-text">Waiting for host...</p>
                </div>
            </div>
        </div>
    </div>

</template>

<style scoped lang="scss">

// Créer une transition de rotation pour l'élément vinyl
@keyframes vinyl-rotation {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}


.room-settings {
    padding: $spacing-xl;
    background: rgba($color-black, 0.2);
    border-radius: $radius-lg;

    .setting-label {
        font-size: $font-size-xs;
        color: $color-text-muted;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        font-weight: 700;
    }

    .leave-button {
        background: rgba($color-black, 0.4);
        border: 1px solid rgba($color-white, 0.1);
        color: $color-white;
        width: 40px;
        height: 40px;
        border-radius: $radius-md;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all $duration-fast $authenticMotion;
        backdrop-filter: blur(4px);

        &:hover {
            background: $color-error;
            border-color: $color-error;
            color: $color-white;
            transform: scale(1.05);
            box-shadow: 0 4px 15px rgba($color-error, 0.4);
        }
    }

    .invite-section-card, .settings-card {
        background: $color-surface;
        padding: $spacing-lg;
        border-radius: $radius-md;
        border: 1px solid $color-border;
    }

    .players-section {
        min-height: 0; // Important for overflow
        
        .player-list-wrapper {
            flex-grow: 1;
            overflow-y: auto;
            padding-right: 5px;

            &::-webkit-scrollbar {
                width: 4px;
            }
            &::-webkit-scrollbar-track {
                background: transparent;
            }
            &::-webkit-scrollbar-thumb {
                background: $color-border;
                border-radius: $radius-full;
            }
        }
    }

    .mixer-control {
        .track-count-badge {
            background: $color-accent-gradient;
            color: $color-black;
            padding: 4px 12px;
            border-radius: $radius-full;
            font-size: $font-size-sm;
            font-weight: 800;
            box-shadow: $shadow-sm;
        }

        .slider-container {
            position: relative;
            padding-bottom: 5px;
        }

        .track-count-slider {
            -webkit-appearance: none;
            width: 100%;
            height: 6px;
            background: rgba($color-white, 0.1);
            border-radius: $radius-full;
            outline: none;
            margin: 10px 0;

            &::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 18px;
                height: 18px;
                border-radius: $radius-full;
                background: $color-white;
                cursor: pointer;
                border: 3px solid $color-accent;
                box-shadow: $shadow-md;
                transition: transform $duration-fast;
            }

            &:active::-webkit-slider-thumb {
                transform: scale(1.2);
            }
        }

        .slider-marks {
            display: flex;
            justify-content: space-between;
            margin-top: 2px;
            color: $color-text-muted;
            font-size: $font-size-xs;
            font-weight: 600;
        }
    }

    .start-button {
        width: 100%;
        padding: $spacing-md;
        font-size: $font-size-base;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .waiting-indicator {
        background: rgba($color-white, 0.05);
        padding: $spacing-sm $spacing-lg;
        border-radius: $radius-full;
        border: 1px solid $color-border;

        .pulse-dot {
            width: 8px;
            height: 8px;
            background: $color-accent;
            border-radius: $radius-full;
            animation: pulse-dot 1.5s infinite;
        }
    }
}

@keyframes pulse-dot {
    0% { transform: scale(0.95); opacity: 0.5; }
    50% { transform: scale(1.2); opacity: 1; }
    100% { transform: scale(0.95); opacity: 0.5; }
}

@keyframes pulse {
    0% { opacity: 0.5; }
    50% { opacity: 1; }
    100% { opacity: 0.5; }
}

@media (max-width: 1000px) {
    .room-settings {
        width: 100% !important;
        padding: 10px;
        height: fit-content;
        align-items: center;
        justify-content: start;
        gap: 10px;

        .vinyl-container {
            img {
                display: none;
            }
        }
    }
}

@media (max-width: 450px) {
    .button-container {
        flex-wrap: wrap;
    }

    .vinyl-container {
        padding: 0 !important;
    }

}

</style>