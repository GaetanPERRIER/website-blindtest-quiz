<script setup>
import { usePlayerStore } from "@/stores/playerStore.js";
import { computed } from "vue";
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

// Vérifie si cette catégorie est celle sélectionnée dans la room
const isSelected = computed(() => {
    return room.value.setting?.category?.id === category.id;
});

function selectCategory() {
    socket.emit("selectCategory", room.value.id, category);
}

</script>

<template>
    <div @click="selectCategory" class="category u-flex u-flex-direction-column u-align-items-center u-justify-content-center u-gap10" :class="{ selected: isSelected }">
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
        z-index: 1;
    }

    &:hover {
        box-shadow: rgba(255, 255, 255, 0.75) 0px 5px 15px;
    }

    &.selected {
        transform: scale(1.1);

        .opacity-filter {
        opacity: 0.2;
        }
    }
}
</style>
