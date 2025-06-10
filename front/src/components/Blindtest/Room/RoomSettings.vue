<script setup>

</script>

<template>
    <div class="room-settings u-flex u-flex-direction-column u-gap20 h100 w50">
        <h2 class="t-title t-color-white">Room Settings</h2>
        <div>
            <label class="t-body-text t-color-white">Difficulté</label>
            <div class="button-container u-flex w100 u-justify-content-center u-gap10 u-mt10">
                <button class="t-body-text">Facile</button>
                <button class="t-body-text">Moyen</button>
                <button class="t-body-text">Difficile</button>
            </div>
        </div>
        <div class="vinyl-container u-flex u-flex-direction-column u-justify-content-center u-align-items-center u-gap10">
            <img src="/Settings/vinyl.png" alt="">
            <input type="range">
        </div>
        <div class="w100 u-flex u-justify-content-center u-align-items-center">
            <button class="play-button t-body-text">Lancer la partie</button>
        </div>

    </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

.room-settings {
    padding: 10px;
    justify-content: start;

    .button-container {
        button {
            display: flex;
            width: 100%;
            padding: 10px 25px;
            border-radius: 15px;
            font-size: 18px;
            cursor: pointer;
            background-color: rgba(0, 0, 0, 0.5);
            color: #fff;
            transition: all 200ms $authenticMotion;
            text-align: center;

            &:hover {
                background-color: rgba(0, 0, 0, 0.7);
                transform: scale(1.05);
            }
        }
    }

    .vinyl-container {
        width: 100%;
        padding: 0 50px;

        img {
            width: 100%;
        }

        input[type="range"] {
            width: 100%;
            margin: 0;
        }
    }

    .play-button {
        display: flex;
        padding: 10px 25px;
        border-radius: 15px;
        font-size: 18px;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
        transition: all 200ms $authenticMotion;
        text-align: center;

        &:hover {
            background-color: rgba(0, 0, 0, 0.7);
            transform: scale(1.05);
        }
    }
}

</style>