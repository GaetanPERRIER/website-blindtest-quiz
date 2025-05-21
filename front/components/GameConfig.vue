<script setup>
import { ref } from 'vue';

const nbSubCircles = 5;
</script>

<template>
    <div class="game-config">
        <div class="vinyl-container">
            <img class="circle" src="/vinyl.png" alt="">
        </div>
    </div>
</template>

<style scoped lang="scss">
.game-config {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    height: 100%;

    .circle {
        width: 650px;
        height: 650px;
        border-radius: 50%;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: rotate(-90deg);
    }
}


</style>