<script setup>
import GameConfig from "~/components/GameConfig.vue";
</script>

<template>

    <div class="room-config">
        <div class="top-side w100">
            <div class="game-config-container">
                <GameConfig/>
            </div>
            <div class="blindtest-categories-container">
                <BlindtestCategories/>
            </div>
        </div>
        <div class="bottom-side w100">
            <div class="player-list-container w100 h100">
                <PlayerList/>
            </div>
            <div class="invite-button-container w30">
                <InviteButton/>
            </div>
        </div>

    </div>

</template>

<style scoped lang="scss">

.room-config {
    width: 62.5vw;
    height: 74.0740741vh;
    border: 0.1041666666666667vw solid rgba(255, 255, 255, 0.3);
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 0.78125vw;
    backdrop-filter: blur(0.2604166666666667vw);


    .top-side {
        width: 100%;
        height: 85%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;

        border-bottom: 0.1041666666666667vw solid rgba(255, 255, 255, 0.3);

        .game-config-container {
            height: 100%;
            border-top-left-radius: 0.78125vw;
            width: 60%;
            border-right: 0.1041666666666667vw solid rgba(255, 255, 255, 0.3);
        }

        .blindtest-categories-container {
            height: 100%;
            border-top-right-radius: 0.78125vw;
            width: 40%;
        }
    }

    .bottom-side {
        width: 100%;
        height: 15%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom-left-radius: 0.78125vw;
        border-bottom-right-radius: 0.78125vw;
        background-color: rgba(0, 0, 0, 0.25);
        overflow: hidden;

        .invite-button-container {
            border-left: 0.1041666666666667vw solid rgba(255, 255, 255, 0.3);
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

    }

}

</style>