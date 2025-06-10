<script setup>

import {useRouter} from "vue-router";

const router = useRouter();

defineProps({
    path : String
})

function Redirect(path) {
    router.push(path)
}

</script>

<template>
    <img class="back-arrow" src="/BackNavigationArrow/fleche.png" alt="" @click="Redirect(path)">
</template>

<style scoped lang="scss">
@import "@/assets/styles/settings/settings";

.back-arrow {
    z-index: 1000;
    position: absolute;
    top: 15px;
    left: 15px;
    width: 60px;
    cursor: pointer;
    transition: all 400ms $authenticMotion;
    transform: rotateX(180deg) rotateZ(90deg);
    background-color: rgba(255, 255, 255, 0.85);
    border-radius: 50%;
    padding: 10px;

    &:hover {
        transform: scale(1.1) rotateY(360deg) rotateZ(90deg);

    }
}

</style>