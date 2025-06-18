<script setup>

import CardInfos from './Utils/CardInfos.vue';

const cardInfosData = [
    {
        cardInfoTitle : "Tu kiffes le jeu ?",
        cardInfoIconPath : "/Home/CardInfos/coffee.png",
        cardInfoContent : "Je suis étudiant et développe ce projet sur mon temps libre. Soutiens moi en m'offrant un café, ça m'aide à développer de nouveaux jeux et features.",
        cardInfoButtonLabel: "Buy me a coffee"
    },
    {
        cardInfoTitle : "Tu kiffes le jeu ?",
        cardInfoIconPath : "/Home/CardInfos/coffee.png",
        cardInfoContent : "Je suis étudiant et développe ce projet sur mon temps libre. Soutiens moi en m'offrant un café, ça m'aide à développer de nouveaux jeux et features.",
        cardInfoButtonLabel: "Buy me a coffee"
    },
]

</script>

<template>

<section class="u-flex u-justify-content-center u-align-items-center u-gap35 u-flex-direction-column--m">
    <CardInfos v-for="cardInfo in cardInfosData" :card-info-data="cardInfo"/>
</section>

</template>


<style scoped lang="scss">

</style>

