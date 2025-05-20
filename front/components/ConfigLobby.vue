<script setup>

</script>

<template>

    <div class="room-config">
        <div class="top-side w100">
            <div class="game-config">

            </div>
            <div class="blindtest-categories">

            </div>
        </div>
        <div class="bottom-side w100">
            <div class="player-list-container w100">
                <PlayerList/>
            </div>
            <div class="invite-button-container w25">
                <InviteButton/>
            </div>
        </div>

    </div>

</template>

<style scoped lang="scss">

.room-config {
    width: 62.5vw;
    height: 74.0740741vh;
    border: 2px solid rgba(255, 255, 255, 0.3);
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 15px;
    backdrop-filter: blur(5px);


    .top-side {
        width: 100%;
        height: 85%;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 2px solid rgba(255, 255, 255, 0.3);

        .game-config {
            height: 100%;
            border-top-left-radius: 15px;
            width: 60%;
            border-right: 2px solid rgba(255, 255, 255, 0.3);
        }

        .blindtest-categories {
            height: 100%;
            border-top-right-radius: 15px;
            width: 40%;
        }
    }

    .bottom-side {
        width: 100%;
        height: 15%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
        background-color: rgba(0, 0, 0, 0.25);


        .invite-button-container {
            border-left: 2px solid rgba(255, 255, 255, 0.3);
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }

    }

}

</style>