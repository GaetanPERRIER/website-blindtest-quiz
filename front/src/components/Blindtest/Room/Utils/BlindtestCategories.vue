<script setup>
import Category from "@/components/Blindtest/Room/Utils/Category.vue";
import { usePlayerStore } from "@/stores/playerStore.js";
import socket from "@/utils/socket.js";
import { computed, onMounted } from "vue";

const playerStore = usePlayerStore();

const categories = computed(() => playerStore.categories);
const currentPlayer = computed(() =>
    playerStore.room.players.find(player => player.socketId === socket.id)
)
const room = computed(() => playerStore.room);
const hostPlayer = computed(() => room.value.players.find(player => player.host));
const songCount = computed({
    get: () => playerStore.room.setting.songCount,
    set: (value) => socket.emit("selectSongCount", room.value.id, value)
});

function setSongCount(event) {
    socket.emit("selectSongCount", room.value.id, event.target.value);
}

onMounted(async () => {
    if (playerStore.categories.length > 0) return;
    try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/music/list-playlists`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        if (Array.isArray(data)) {
            playerStore.setCategories(data);
        }
    } catch (error) {
        console.error('Failed to fetch categories:', error.message);
    }
});
</script>

<template>
    <div v-if="currentPlayer && currentPlayer.host" class="blindtest-categories w65 h100 u-flex-direction-column u-flex u-gap10 u-p10">
        <input class="search-bar t-color-white t-body-text w100" placeholder="Search a category...">
        <div class="u-flex u-flex-direction-column u-gap25 global-categories-container">
            <div class="u-flex u-flex-direction-column u-gap15 u-pt15">
                <div class="u-flex u-justify-content-between u-align-items-center u-pr15">
                    <h2 class="t-body-text t-color-white fs25px">Popular categories</h2>
                    <div class="u-flex u-align-items-center u-gap15">
                        <p class="t-body-text categories-count">{{ categories.length }} available</p>
                    </div>
                </div>
                <div class="categories w100">
                    <div v-for="category in categories" :key="category.id" class="category-container">
                        <Category :category="category"/>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else class="blindtest-categories w50 u-flex-direction-column u-flex u-justify-content-center u-align-items-center u-gap20 u-p10">
        <h2 v-if="hostPlayer" class="t-body-text t-color-white t-align-center">{{ hostPlayer.username }} is setting up the game...</h2>
        <div v-if="room.setting.category" class="selected-category-preview u-flex-direction-column u-align-items-center u-gap15">
            <img :src="room.setting.category.cover_url" alt="Waiting for host" class="img-category">
            <p class="category-name t-body-text">{{ room.setting.category.name }}</p>
        </div>
    </div>
</template>

<style scoped lang="scss">

.blindtest-categories {
    input {
        background-color: $color-surface;
        padding: 12px 25px;
        border-radius: 50px;
        font-size: $font-size-base;
        border: 1px solid $color-border;
        color: $color-text;
        transition: all $duration-normal $authenticMotion;

        &:focus {
            border-color: $color-accent;
            background-color: $color-surface-hover;
            outline: none;
        }

        &::placeholder {
            color: $color-text-muted;
        }
    }

    .global-categories-container {
        overflow-y: auto;
        padding-right: 5px;

        &::-webkit-scrollbar {
            width: 4px;
        }

        &::-webkit-scrollbar-thumb {
            background-color: $color-border;
            border-radius: 10px;
        }

        .categories-count {
            background-color: $color-surface;
            color: $color-text-muted;
            padding: 4px 12px;
            font-size: $font-size-xs;
            border-radius: 100px;
            border: 1px solid $color-border;
        }
    }

    .categories {
        display: flex;
        flex-wrap: wrap;

        .category-container {
            width: 25%;
            padding: $spacing-sm;
        }
    }


    .selected-category-preview {
        .img-category {
            width: 240px;
            height: 240px;
            border-radius: 20px;
            object-fit: cover;
            box-shadow: $shadow-lg;
            border: 2px solid $color-border;
        }

        .category-name {
            font-size: $font-size-xl;
            font-weight: 600;
            color: $color-text;
        }
    }
}

@media (max-width: 1000px) {
    .blindtest-categories {
        width: 100% !important;
        height: 100% !important;
        overflow-x: auto;


    }

}

</style>