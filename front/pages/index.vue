<script setup>
const gamemodes = ["Blindtest", "Quizz", "Films"];
</script>

<template>
    <div class="menu-container u-flex u-flex-direction-column u-justify-content-center u-align-items-center u-gap15">
        <NuxtLink v-for="gamemode in gamemodes" :key="gamemode" :to="`/${gamemode.toLowerCase()}`">
            {{ gamemode }}
        </NuxtLink>
    </div>
</template>

<style scoped lang="scss">
    .menu-container {
        width: 100vw;
        height: 100vh;

        a {
            border: 1px solid black;
            padding: 25px;
            width: 200px;
            text-align: center;
            text-decoration: none;
            color: black;
        }
    }
</style>