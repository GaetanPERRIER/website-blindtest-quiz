<script setup>
import {onMounted, ref} from "vue";


onMounted(() => {

    const gradientElement = document.querySelector(".particle-background");
    if (gradientElement) {
        gradientElement.style.background = "linear-gradient(161deg,rgba(255, 223, 107, 1) 0%, rgba(255, 110, 110, 1) 48%, rgba(115, 173, 201, 1) 80%, rgba(56, 159, 255, 1) 100%)";
        gradientElement.style.animation = "gradient 10s ease infinite";
        gradientElement.style.backgroundSize = "200% 200%";
    }

});


</script>

<template>
    <div class="particle-background">
        <div v-for="i in 30" :key="'particle-'+i" class="music-note"
             :style="{
                     left: `${Math.random() * 100}%`,
                     top: `${Math.random() * 100}%`,
                     animationDelay: `${Math.random() * 5}s`,
                     fontSize: `${(Math.random() * 20 + 10) / 1920 * 100}vw`,
                     opacity: Math.random() * 0.5 + 0.3
                 }">
            {{ ['♩', '♪', '♫', '♬', '♭', '♮'][Math.floor(Math.random() * 6)] }}
        </div>
    </div>
</template>

<style lang="scss">


@keyframes noteFloat {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
}


@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}

.particle-background {

    //background: linear-gradient(161deg, rgba(194, 56, 139, 1) 0%, rgba(61, 186, 227, 1) 33%, rgba(227, 188, 70, 1) 67%, rgba(196, 71, 71, 1) 100%);

    //background: linear-gradient(161deg,rgba(232, 86, 149, 1) 0%, rgba(224, 129, 129, 1) 22%, rgba(219, 210, 112, 1) 50%, rgba(144, 232, 144, 1) 74%, rgba(94, 169, 255, 1) 100%);

    //background: linear-gradient(161deg,rgba(59, 144, 235, 1) 0%, rgba(242, 119, 119, 1) 15%, rgba(245, 170, 105, 1) 33%, rgba(237, 219, 100, 1) 50%, rgba(235, 184, 108, 1) 67%, rgba(242, 119, 119, 1) 85%, rgba(59, 144, 235, 1) 100%);

    //background: linear-gradient(161deg,rgba(192, 232, 137, 1) 0%, rgba(237, 218, 157, 1) 15%, rgba(237, 172, 159, 1) 32%, rgba(237, 149, 230, 1) 50%, rgba(237, 172, 159, 1) 67%, rgba(237, 218, 157, 1) 85%, rgba(192, 232, 137, 1) 100%);

    //background: linear-gradient(161deg,rgba(255, 223, 107, 1) 0%, rgba(255, 110, 110, 1) 48%, rgba(115, 173, 201, 1) 80%, rgba(56, 159, 255, 1) 100%);

    //background: linear-gradient(161deg,rgba(245, 227, 95, 1) 0%, rgba(232, 67, 67, 1) 48%, rgba(80, 78, 204, 1) 80%, rgba(88, 165, 237, 1) 100%);

    //background: linear-gradient(161deg,rgba(196, 196, 196, 1) 0%, rgba(89, 171, 222, 1) 20%, rgba(161, 113, 235, 1) 37%, rgba(190, 79, 255, 1) 50%, rgba(161, 113, 235, 1) 63%, rgba(89, 171, 222, 1) 80%, rgba(196, 196, 196, 1) 100%);

    //background: linear-gradient(161deg,rgba(0, 0, 0, 1) 0%, rgba(84, 29, 29, 1) 31%, rgba(199, 56, 56, 1) 44%, rgba(217, 101, 230, 1) 74%, rgba(196, 196, 196, 1) 88%, rgba(255, 255, 255, 1) 100%);

    //background: linear-gradient(161deg,rgba(63, 65, 112, 1) 19%, rgba(181, 67, 67, 1) 45%, rgba(201, 95, 153, 1) 61%, rgba(209, 154, 214, 1) 83%, rgba(196, 196, 196, 1) 98%);

    //background: linear-gradient(161deg,rgba(10, 64, 18, 1) 0%, rgba(64, 207, 145, 1) 37%, rgba(58, 199, 194, 1) 78%, rgba(68, 128, 171, 1) 98%);

    //background: linear-gradient(161deg,rgba(34, 10, 64, 1) 0%, rgba(18, 26, 105, 1) 30%, rgba(128, 40, 83, 1) 54%, rgba(207, 35, 98, 1) 71%, rgba(217, 82, 163, 1) 85%, rgba(140, 203, 222, 1) 100%);

    //background: linear-gradient(161deg,rgba(0, 191, 255, 1) 0%, rgba(112, 219, 255, 1) 21%, rgba(59, 206, 255, 1) 44%, rgba(51, 150, 139, 1) 70%, rgba(18, 105, 88, 1) 86%, rgba(34, 84, 64, 1) 100%);

    animation: gradient 10s ease infinite;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    z-index: -1;

    .music-note {
        position: absolute;
        color: #fff;
        //color: rgba(19, 19, 19, 0.89);
        animation: noteFloat 15s linear infinite;
    }
}

</style>