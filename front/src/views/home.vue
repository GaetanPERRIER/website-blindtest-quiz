<script setup>

import Header from '@/components/Basics/Header.vue';
import Footer from '@/components/Basics/Footer.vue';
import Introduction from "@/components/Home/Introduction.vue";
import MoreGames from "@/components/Home/MoreGames.vue";
import BannerInfos from "@/components/Home/BannerInfos.vue";
import ParticleBackground from "@/components/Basics/ParticleBackground.vue";
import BuyMeACoffeeBugReport from '@/components/Home/BuyMeACoffee&BugReport.vue';

</script>

<template>
    <div class="page-container">
        <Header/>
        <div class="global-content u-flex u-flex-direction-column u-align-items-center">
            <Introduction/>
            <MoreGames />
            <BannerInfos/>
            <BuyMeACoffeeBugReport/>
        </div>
        <Footer/>

        <ParticleBackground/>
    </div>
</template>

<style scoped lang="scss">

.page-container {
    min-height: 100vh;

    .global-content {
        gap: 150px;
        margin-top: 175px;
        margin-bottom: 200px;
        position: relative;
        z-index: 1;
    }

    @media (max-width: 1000px) {
        .global-content {
            margin-top: 150px;
            gap: 125px;
            margin-bottom: 150px;
        }
    }

    @media (max-width: 768px) {
        .global-content {
            margin-top: 125px;
            gap: 100px;
            margin-bottom: 125px;
        }
    }
}




</style>