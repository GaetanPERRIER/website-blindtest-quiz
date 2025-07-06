<script setup>
import Header from '@/components/Basics/Header.vue';
import Footer from '@/components/Basics/Footer.vue';
import Introduction from "@/components/Home/Introduction.vue";
import MoreGames from "@/components/Home/MoreGames.vue";
import BannerInfos from "@/components/Home/BannerInfos.vue";
import ParticleBackground from "@/components/Basics/ParticleBackground.vue";
import BuyMeACoffeeBugReport from '@/components/Home/BuyMeACoffee&BugReport.vue';
import ScaleSpawnAnimation from "@/components/Basics/ScaleSpawnAnimation.vue";
import { ref, onMounted } from 'vue'

const visible = ref(false)

</script>

<template>
    <div class="page-container">
        <Header/>
        <main class="global-content">
            <Introduction/>
            <MoreGames />
            <BannerInfos/>
            <BuyMeACoffeeBugReport/>
        </main>
        <Footer/>
        <ParticleBackground/>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

.page-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;

    .global-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 120px;
        padding: 150px 0 200px;
        position: relative;
        z-index: 1;

        @media (max-width: 1000px) {
            gap: 100px;
            padding: 120px 0 150px;
        }

        @media (max-width: 768px) {
            gap: 80px;
            padding: 100px 0 120px;
        }
    }
}
</style>