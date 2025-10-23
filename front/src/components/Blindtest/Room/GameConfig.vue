<script setup>

import BlindtestCategories from "@/components/Blindtest/Room/Utils/BlindtestCategories.vue";
import RoomSettings from "@/components/Blindtest/Room/Utils/RoomSettings.vue";

</script>

<template>
    <div class="game-config u-flex u-align-items-center u-flex-direction-column--m u-p15">
        <BlindtestCategories/>
        <div class="vertical-line"></div>
        <RoomSettings/>
    </div>
</template>

<style scoped lang="scss">

.game-config {
    width: 100%;
    height: 100%;
    justify-content: start;
    background-color: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    backdrop-filter: blur(10px);

    .vertical-line {
        width: 1px;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2);
        margin: 0 10px;
    }
}

@media (max-width: 1000px) {
    .game-config {
        width: 100%;
        height: 95vh;
        gap: 20px;
    }

    .vertical-line {
        display: none;
    }
}


</style>