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
        <img :src="category.cover_url" :alt="category.name">
    </div>
</template>

<style scoped lang="scss">

.category {
    position: relative;
    cursor: pointer;
    border-radius: $radius-md;
    aspect-ratio: 1/1;
    transition: all $duration-normal $authenticMotion;
    box-shadow: $shadow-md;

    .opacity-filter {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: $radius-md;
        transition: opacity $duration-normal $authenticMotion;
        opacity: 0;
    }

    img {
        width: 100%;
        height: 100%;
        border-radius: $radius-md;
        z-index: 1;
        border: 1px solid $color-border;
    }

    &:hover {
        transform: translateY(-4px);
        box-shadow: $shadow-lg;
        
        img {
            border-color: $color-border-hover;
        }
    }

    &.selected {
        transform: scale(1.05);
        
        img {
            border-color: $color-accent;
            border-width: 2px;
        }

        .opacity-filter {
            opacity: 0.2;
        }
    }
}
</style>
