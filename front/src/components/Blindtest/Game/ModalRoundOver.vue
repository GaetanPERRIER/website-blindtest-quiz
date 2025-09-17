<script setup>
import {usePlayerStore} from "@/stores/playerStore.js";
import {computed, onMounted, ref} from "vue";
import socket from "@/utils/socket.js";
import Player from "@/components/Blindtest/Room/Utils/Player.vue";
import LinearLoadingBar from "@/components/Blindtest/Game/LinearLoadingBar.vue";

const playerStore = usePlayerStore();

const room = computed(() => playerStore.room);
const musicToGuess = computed(() => playerStore.room.currentMusic);


// References
const modal = ref(null)

// Static values
const topPlayers = [
    {
        host : true,
        roomId : null,
        username : "CalerLeTriso",
        socketId : "",
        titleGuessed : true,
        roundScore : 1089,
        totalScore : 0,
        speed : 1500, // ms
    },
    {
        host : false,
        roomId : null,
        username : "CalerLeTriso",
        socketId : "",
        titleGuessed : true,
        roundScore : 875,
        speed : 1500, // ms
    },
    {
        host : false,
        roomId : null,
        username : "CalerLeTriso",
        socketId : "",
        titleGuessed : true,
        roundScore : 698,
        totalScore : 0,
        speed : 1500, // ms
    },
]


onMounted(() => {

})
</script>

<template>
    <div ref="modal" class="modal-round-over u-flex u-flex-direction-column u-gap25 u-justify-content-center u-align-items-center">
        <h2 class="t-title t-color-white">Manche 1 terminée</h2>
        <p class="t-body-text t-color-white">Il fallait deviner : {{musicToGuess.title_short}} - {{musicToGuess.artist.name}}</p>
        <div class="u-flex u-flex-direction-column u-gap25">
            <div class="cards-recap-container u-flex u-justify-content-center u-align-items-end u-gap10">
                <div class="card-recap card-second">
                    <Player :player="topPlayers[1]"/>
                    <p class="speed t-body-text">{{topPlayers[1].speed / 1000}}s</p>
                    <p class="score t-body-text">+ {{topPlayers[1].roundScore}} points</p>
                </div>
                <div class="card-recap card-first">
                    <Player :player="topPlayers[0]"/>
                    <p class="speed t-body-text">{{topPlayers[0].speed / 1000}}s</p>
                    <p class="score t-body-text">+ {{topPlayers[0].roundScore}} points</p>
                </div>
                <div class="card-recap card-third">
                    <Player :player="topPlayers[2]"/>
                    <p class="speed t-body-text">{{topPlayers[2].speed / 1000}}s</p>
                    <p class="score t-body-text">+ {{topPlayers[2].roundScore}} points</p>
                </div>
            </div>
            <LinearLoadingBar width="100%"/>
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