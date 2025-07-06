<script setup>

import { usePlayerStore } from "@/stores/playerStore.js";
import { computed, onMounted} from "vue";

import socket from "@/utils/socket.js";
import { defineProps } from "vue";

const playerStore = usePlayerStore();

const room = computed(() => playerStore.room);

const { category } = defineProps({
    category: {
        type: Object,
        required: true
    }
});

function selectCategory() {
    socket.emit("selectCategory", room.value.id, category);
}

</script>

<template>
    <div @click="selectCategory"
         class="category u-flex u-flex-direction-column u-align-items-center u-justify-content-center u-gap10">
        <div class="opacity-filter"></div>
        <img :src="category.picture_big" alt="">
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

.category {
    position: relative;
    cursor: pointer;
    border-radius: 10px;
    aspect-ratio: 1/1;
    transition: all 350ms $authenticMotion;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 15px;

    .opacity-filter {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 10px;
        transition: opacity 350ms $authenticMotion;
        opacity: 0;
    }

    img {
        width: 100%;
        height: 100%;
        border-radius: 10px;
    }

    &:hover {
        border-radius: 10px;
        box-shadow: rgba(255, 255, 255, 0.5) 0px 5px 15px;
    }
}

</style>