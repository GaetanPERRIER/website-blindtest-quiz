<script setup>


import PlayerList from "@/components/Blindtest/Room/PlayerList.vue";
import GameConfig from "@/components/Blindtest/Room/GameConfig.vue";
</script>

<template>
    <div class="room-config u-flex u-align-items-center u-justify-content-center u-gap50">
        <GameConfig/>
        <PlayerList />
    </div>
</template>

<style scoped lang="scss">

.room-config {
    width: 100vw;
    height: 100vh;
}

@media  (max-width: 1000px) {
    .room-config {
        flex-direction: column;
    }

}

</style>