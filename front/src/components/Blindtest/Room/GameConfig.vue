<script setup>

import BlindtestCategories from "@/components/Blindtest/Room/BlindtestCategories.vue";
import RoomSettings from "@/components/Blindtest/Room/RoomSettings.vue";

</script>

<template>
    <div class="game-config u-flex u-align-items-center u-p15">
        <BlindtestCategories/>
        <div class="vertical-line"></div>
        <RoomSettings/>
    </div>
</template>

<style scoped lang="scss">

.game-config {
    width: 800px;
    height: 600px;
    justify-content: start;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 15px;

    .vertical-line {
        width: 1px;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.2);
        margin: 0 10px;
    }
}


</style>