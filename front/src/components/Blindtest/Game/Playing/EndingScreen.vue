<script setup>
import {usePlayerStore} from "@/stores/playerStore.js";
import { useRouter } from "vue-router";
import {computed, ref, onMounted} from "vue";
import PlayerList from "@/components/Blindtest/Room/Utils/PlayerList.vue";
import socket from "@/utils/socket";

const router = useRouter()
const playerStore = usePlayerStore()

// Variables computed depuis le store
const room = computed(() => playerStore.room)
const playersReadyCount = computed(() => {
    return playerStore.room.players.filter(player => player.isReady === true).length
})

// Calculer le classement final des joueurs
const finalRanking = computed(() => {
    return [...room.value.players]
        .sort((a, b) => b.totalScore - a.totalScore)
        .map((player, index) => ({
            ...player,
            position: index + 1
        }))
})

// Calculer les statistiques de la partie
const gameStats = computed(() => {
    const totalRounds = room.value.setting.songCount
    const totalPlayers = room.value.players.length
    const playersWhoGuessed = room.value.players.filter(p => p.totalScore > 0).length
    
    return {
        totalRounds,
        totalPlayers,
        playersWhoGuessed,
        successRate: Math.round((playersWhoGuessed / totalPlayers) * 100)
    }
})


// Functions
const PlayAgain = () => {
    socket.emit('playAgain', room.value.id)
}

const GoHome = () => {
    socket.emit('leaveRoom', room.value.id)
    playerStore.resetRoom()
    router.push(`/`);
}

function getPlayerIndex(socketId) {
    return room.value.players.findIndex(p => p.socketId === socketId);
}

function getPlayerColor(index) {
    const colors = ['#FF6B6B', '#4ECDC4', '#A29BFE', '#FFEAA7', '#FD79A8', '#55EFC4'];
    return colors[index % colors.length];
}


</script>


<template>
    <div class="ending-screen-container" :class="{ 'is-winner': finalRanking[0]?.socketId === socket.id }">
        <div class="confetti-container"></div>
        
        <header class="ending-header">
            <h2 class="t-title">Game Over!</h2>
            <p class="winner-announcement" v-if="finalRanking[0]">
                {{ finalRanking[0].username }} won the match!
            </p>
        </header>
        
        <!-- Podium visuel -->
        <div class="podium-visual">
            <!-- 2nd -->
            <div v-if="finalRanking[1]" class="podium-col podium-2nd">
                <div class="player-avatar-podium" :style="{ backgroundColor: getPlayerColor(getPlayerIndex(finalRanking[1].socketId)) }">
                    {{ finalRanking[1].username.substring(0, 2).toUpperCase() }}
                </div>
                <div class="podium-bar">
                    <span class="rank-num">2</span>
                </div>
                <span class="player-name">{{ finalRanking[1].username }}</span>
            </div>
            
            <!-- 1st -->
            <div v-if="finalRanking[0]" class="podium-col podium-1st">
                <div class="crown-icon">👑</div>
                <div class="player-avatar-podium" :style="{ backgroundColor: getPlayerColor(getPlayerIndex(finalRanking[0].socketId)) }">
                    {{ finalRanking[0].username.substring(0, 2).toUpperCase() }}
                </div>
                <div class="podium-bar">
                    <span class="rank-num">1</span>
                </div>
                <span class="player-name">{{ finalRanking[0].username }}</span>
            </div>
            
            <!-- 3rd -->
            <div v-if="finalRanking[2]" class="podium-col podium-3rd">
                <div class="player-avatar-podium" :style="{ backgroundColor: getPlayerColor(getPlayerIndex(finalRanking[2].socketId)) }">
                    {{ finalRanking[2].username.substring(0, 2).toUpperCase() }}
                </div>
                <div class="podium-bar">
                    <span class="rank-num">3</span>
                </div>
                <span class="player-name">{{ finalRanking[2].username }}</span>
            </div>
        </div>

        <!-- Statistiques -->
        <div class="game-stats">
            <div class="stat-card">
                <div class="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle></svg>
                </div>
                <div class="stat-content">
                    <span class="stat-value">{{ gameStats.totalRounds }}</span>
                    <span class="stat-label">Tracks played</span>
                </div>
            </div>
            <div class="stat-card">
                <div class="stat-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                </div>
                <div class="stat-content">
                    <span class="stat-value">{{ gameStats.successRate }}%</span>
                    <span class="stat-label">Success rate</span>
                </div>
            </div>
        </div>

        <!-- Liste complète -->
        <div class="full-ranking-list">
            <div v-for="player in finalRanking" :key="player.socketId" class="ranking-row">
                <span class="rank">#{{ player.position }}</span>
                <span class="name">{{ player.username }}</span>
                <span class="score">{{ player.totalScore }} pts</span>
            </div>
        </div>

        <!-- Actions -->
        <div class="actions-group">
                <button v-if="room.players.find(p => p.socketId === socket.id)?.host" @click="PlayAgain" class="btn-primary">
                    Play Again
                </button>
                <button @click="GoHome" class="btn-secondary">
                    Back to Home
                </button>
        </div>
    </div>
</template>


<style lang="scss" scoped>
@import '@/assets/styles/settings/settings.scss';

.ending-screen-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 60px 20px;
    gap: 40px;
    overflow-y: auto;
    z-index: 2;
    position: relative;
    
    &.is-winner {
        background: radial-gradient(circle at center, rgba(255, 187, 51, 0.15) 0%, transparent 70%);
    }
}

.ending-header {
    text-align: center;
    
    .t-title {
        font-size: $font-size-3xl;
        margin-bottom: $spacing-sm;
        background: $color-primary-gradient;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    
    .winner-announcement {
        font-size: $font-size-xl;
        color: $color-text-muted;
        font-weight: 500;
    }
}

// Podium
.podium-visual {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 20px;
    height: 300px;
    width: 100%;
    max-width: 600px;
    margin-top: 40px;

    .podium-col {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 120px;
        
        .player-avatar-podium {
            width: 60px;
            height: 60px;
            border-radius: $radius-full;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: $font-size-lg;
            color: $color-black;
            border: 3px solid rgba(255, 255, 255, 0.2);
            box-shadow: $shadow-lg;
            margin-bottom: 15px;
            z-index: 2;
        }

        .podium-bar {
            width: 100%;
            border-radius: $radius-md $radius-md 0 0;
            display: flex;
            justify-content: center;
            padding-top: 20px;
            position: relative;
            background: $color-primary-gradient;
            box-shadow: $shadow-lg;
            
            .rank-num {
                font-size: $font-size-2xl;
                font-weight: 900;
                color: rgba(255, 255, 255, 0.3);
            }
        }
        
        .player-name {
            margin-top: 15px;
            font-weight: 600;
            color: $color-text;
            text-align: center;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .podium-1st {
        .crown-icon { font-size: 32px; margin-bottom: -10px; z-index: 3; }
        .player-avatar-podium { width: 80px; height: 80px; font-size: $font-size-xl; border-color: $color-accent; }
        .podium-bar { height: 160px; background: linear-gradient(to bottom, $color-accent, rgba(255, 187, 51, 0.3)); .rank-num { color: $color-black; opacity: 0.5; } }
        animation: podium-rise-1 1s $authenticMotion both;
    }
    
    .podium-2nd {
        .podium-bar { height: 110px; background: linear-gradient(to bottom, #E2E2E2, rgba(226, 226, 226, 0.2)); }
        animation: podium-rise-2 1s $authenticMotion 0.2s both;
    }
    
    .podium-3rd {
        .podium-bar { height: 70px; background: linear-gradient(to bottom, #CD7F32, rgba(205, 127, 50, 0.2)); }
        animation: podium-rise-3 1s $authenticMotion 0.4s both;
    }
}

// Stats
.game-stats {
    display: flex;
    gap: 20px;
    width: 100%;
    max-width: 600px;
    
    .stat-card {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 20px;
        background: $color-surface;
        border-radius: $radius-lg;
        border: 1px solid $color-border;
        backdrop-filter: blur(10px);
        transition: all $duration-normal $authenticMotion;

        &:hover {
            background: $color-surface-hover;
            transform: translateY(-5px);
            border-color: $color-border-hover;
        }
        
        .stat-icon {
            background: rgba(255, 255, 255, 0.1);
            width: 44px;
            height: 44px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: $color-accent;
        }
        
        .stat-content {
            display: flex;
            flex-direction: column;
            
            .stat-value { font-size: $font-size-xl; font-weight: 800; color: $color-white; }
            .stat-label { font-size: $font-size-xs; color: $color-text-muted; text-transform: uppercase; letter-spacing: 1px; }
        }
    }
}

// Full list
.full-ranking-list {
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    .ranking-row {
        display: flex;
        align-items: center;
        padding: 12px 25px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        
        .rank { width: 40px; font-weight: 700; color: $color-text-light; }
        .name { flex: 1; font-weight: 500; color: $color-text; }
        .score { font-weight: 700; color: $color-accent; }
    }
}

// Actions
.actions-group {
    display: flex;
    gap: 20px;
    margin-top: 20px;
    
    button {
        min-width: 200px;
    }
}

@keyframes podium-rise-1 { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes podium-rise-2 { from { transform: translateY(80px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes podium-rise-3 { from { transform: translateY(60px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

@media (max-width: 600px) {
    .podium-visual { gap: 10px; height: 250px; }
    .podium-col { width: 100px; }
    .game-stats { flex-direction: column; }
    .actions-group { flex-direction: column; width: 100%; button { width: 100%; } }
}
</style>