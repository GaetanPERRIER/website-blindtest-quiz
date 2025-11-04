<script setup>
import {usePlayerStore} from "@/stores/playerStore.js";
import {computed, onMounted, ref} from "vue";
import socket from "@/utils/socket.js";
import Player from "@/components/Blindtest/Room/Utils/Player.vue";

const playerStore = usePlayerStore();

const room = computed(() => playerStore.room);
const musicToGuess = computed(() => playerStore.room.currentMusic);

// References
const modal = ref(null)

// Calculer les joueurs qui ont deviné, triés par score
const playersWhoGuessed = computed(() => {
    return room.value.players
        .filter(player => player.titleGuessed && player.artistGuessed)
        .sort((a, b) => b.totalScore - a.totalScore)
        .slice(0, 3) // Prendre les 3 premiers
});

// Calculer le numéro de la manche actuelle
const currentRound = computed(() => room.value.round + 1);


onMounted(() => {

})
</script>

<template>
    <div ref="modal" class="modal-round-over u-flex u-flex-direction-column u-gap25 u-justify-content-center u-align-items-center">
        <h2 class="t-title t-color-white">Manche {{ currentRound }} terminée</h2>
        <p class="t-body-text t-color-white">Il fallait deviner : {{musicToGuess.title_short}} - {{musicToGuess.artist.name}}</p>
        
        <div v-if="playersWhoGuessed.length > 0" class="u-flex u-flex-direction-column u-gap25">
            <div class="cards-recap-container u-flex u-justify-content-center u-align-items-end u-gap10">
                <!-- Deuxième place -->
                <div v-if="playersWhoGuessed[1]" class="card-recap card-second">
                    <Player :player="playersWhoGuessed[1]"/>
                    <p class="speed t-body-text">-</p>
                    <p class="score t-body-text">+ 100 points</p>
                </div>
                
                <!-- Première place -->
                <div v-if="playersWhoGuessed[0]" class="card-recap card-first">
                    <Player :player="playersWhoGuessed[0]"/>
                    <p class="speed t-body-text">-</p>
                    <p class="score t-body-text">+ 100 points</p>
                </div>
                
                <!-- Troisième place -->
                <div v-if="playersWhoGuessed[2]" class="card-recap card-third">
                    <Player :player="playersWhoGuessed[2]"/>
                    <p class="speed t-body-text">-</p>
                    <p class="score t-body-text">+ 100 points</p>
                </div>
            </div>
        </div>
        
        <!-- Si personne n'a deviné -->
        <div v-else class="u-flex u-flex-direction-column u-gap25 u-align-items-center">
            <p class="t-body-text t-color-white">Personne n'a trouvé la bonne réponse !</p>
        </div>

    </div>
</template>

<style scoped lang="scss">
@import "@/assets/styles/settings/settings";

.modal-round-over {
    width: 800px;
    height: 400px;
    background-color: #E0AE88;
    border-radius: 15px;
    padding: 35px;

    .cards-recap-container {
        width: 100%;
        .card-recap {
            width: fit-content;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 15px;
            border-radius: 15px;
            color: #000 !important;

            span {
                color: #000 !important;
            }

            .speed, .score {
                font-size: 16px;
            }
        }

        .card-first {
            height: 170px;
            background: linear-gradient(160deg,#FFDF77 0%, #FFC947 100%);
        }

        .card-second {
            height: 155px;
            background: linear-gradient(160deg,#E0E0E0 0%, #C0C0C0 100%);
        }
        .card-third {
            height: 140px;
            background: linear-gradient(160deg,#FF9838 0%, #E68A30 100%);
        }
    }



    .next-music {
        padding: 10px 25px;
    }
}
</style>