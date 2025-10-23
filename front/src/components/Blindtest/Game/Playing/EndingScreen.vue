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
const PlayerReady = () => {
    console.log("[Method player ready] : roomId : " + room.value.id, socket.id)
    socket.emit('playerReady', room.value.id, socket.id)
}

const GoHome = () => {
    console.log("[Go Home from ending screen button]")
    socket.emit('goHome', room.value.id, socket.id)
    router.push(`/`);
}


</script>


<template>
    <div class="ending-screen-container">
        <h2 class="t-title t-color-white">🎉 Partie terminée !</h2>
        
        <!-- Statistiques de la partie -->
        <div class="game-stats">
            <div class="stat-item">
                <span class="stat-number">{{ gameStats.totalRounds }}</span>
                <span class="stat-label">Manches jouées</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">{{ gameStats.successRate }}%</span>
                <span class="stat-label">Taux de réussite</span>
            </div>
            <div class="stat-item">
                <span class="stat-number">{{ gameStats.playersWhoGuessed }}/{{ gameStats.totalPlayers }}</span>
                <span class="stat-label">Joueurs actifs</span>
            </div>
        </div>

        <!-- Classement final -->
        <div class="final-ranking">
            <h3 class="t-subtitle t-color-white">🏆 Classement final</h3>
            <div class="ranking-list">
                <div 
                    v-for="player in finalRanking" 
                    :key="player.socketId"
                    class="ranking-item"
                    :class="`position-${player.position}`"
                >
                    <div class="position">{{ player.position }}</div>
                    <div class="player-info">
                        <span class="username">{{ player.username }}</span>
                        <span class="score">{{ player.totalScore }} points</span>
                    </div>
                    <div v-if="player.host" class="host-badge">👑</div>
                </div>
            </div>
        </div>

        <!-- Actions -->
        <div class="actions">
            <button @click="GoHome()" class="cta-home t-body-text t-color-white">
                🏠 Retourner à l'accueil
            </button>
        </div>
    </div>
</template>


<style lang="scss" scoped>
@import '@/assets/styles/settings/settings.scss';

.ending-screen-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    padding: 20px;
    overflow-y: auto;

    h2 {
        font-size: 2.5rem;
        margin-bottom: 10px;
        text-align: center;
    }

    .game-stats {
        display: flex;
        gap: 40px;
        margin-bottom: 20px;

        .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 5px;
            padding: 15px 20px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            border: 2px solid rgba(255, 255, 255, 0.2);

            .stat-number {
                font-size: 1.8rem;
                font-weight: bold;
                color: $major-yellow-color;
            }

            .stat-label {
                font-size: 0.9rem;
                color: rgba(255, 255, 255, 0.8);
                text-align: center;
            }
        }
    }

    .final-ranking {
        width: 100%;
        max-width: 600px;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 25px;
        border: 2px solid rgba(255, 255, 255, 0.2);

        h3 {
            text-align: center;
            margin-bottom: 20px;
            font-size: 1.5rem;
        }

        .ranking-list {
            display: flex;
            flex-direction: column;
            gap: 10px;

            .ranking-item {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 12px 15px;
                border-radius: 10px;
                transition: all 200ms ease;

                &.position-1 {
                    background: linear-gradient(135deg, #FFD700, #FFA500);
                    color: #000;
                    font-weight: bold;
                }

                &.position-2 {
                    background: linear-gradient(135deg, #C0C0C0, #A0A0A0);
                    color: #000;
                }

                &.position-3 {
                    background: linear-gradient(135deg, #CD7F32, #B8860B);
                    color: #fff;
                }

                &:not(.position-1):not(.position-2):not(.position-3) {
                    background-color: rgba(255, 255, 255, 0.1);
                    color: #fff;
                }

                .position {
                    font-size: 1.2rem;
                    font-weight: bold;
                    min-width: 30px;
                    text-align: center;
                }

                .player-info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;

                    .username {
                        font-weight: 500;
                    }

                    .score {
                        font-size: 0.9rem;
                        opacity: 0.8;
                    }
                }

                .host-badge {
                    font-size: 1.2rem;
                }
            }
        }
    }

    .actions {
        margin-top: 20px;

        .cta-home {
            padding: 15px 30px;
            background-color: $major-yellow-color;
            border: none;
            border-radius: 15px;
            font-size: 1.1rem;
            font-weight: 500;
            color: #000;
            transition: all 200ms $authenticMotion;
            cursor: pointer;

            &:hover {
                background-color: darken($major-yellow-color, 10%);
                transform: scale(1.05);
            }
        }
    }
}

@media (max-width: 768px) {
    .ending-screen-container {
        .game-stats {
            flex-direction: column;
            gap: 15px;
            width: 100%;
        }

        .final-ranking {
            width: 100%;
        }
    }
}

</style>