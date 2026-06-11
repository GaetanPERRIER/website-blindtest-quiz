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

onMounted(async () => {
    if (playerStore.categories.length > 0) return;
    try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/deezer/get-categories`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        if (data?.playlists?.data) {
            playerStore.setCategories(data.playlists.data);
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
                    <p class="t-body-text t-color-white categories-count">{{ categories.length }} available</p>
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
        <h2 v-if="hostPlayer" class="t-body-text t-color-white">{{ hostPlayer.username }} is setting up the game...</h2>
        <img v-if="room.setting.category" :src="room.setting.category.picture_big" alt="Waiting for host" class="w100 img-category">
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings';

.blindtest-categories {
    input {
        background-color: rgba(0, 0, 0, 0.5);
        padding: 10px 25px;
        border-radius: 50px;
        font-size: 18px;
        border: 2px solid transparent;
        transition: all 200ms $authenticMotion;

        &:focus {
            border: 2px solid rgba(0, 0, 0, 0.3);
            outline: none;
        }

        &::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }
    }

    .global-categories-container {
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, 0.5) transparent;

        &::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.5);
            border-radius: 10px;
        }

        &::-webkit-scrollbar {
            width: 8px;
        }

        &::-webkit-scrollbar-track {
            background-color: transparent;
        }

        .categories-count {
            background-color: rgba(0, 0, 0, 0.5);
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 100px;
        }
    }

    .categories {
        display: flex;
        flex-wrap: wrap;


        .category-container {
            width: 20%;
            height: fit-content;
            padding-right: 15px;
            padding-bottom: 15px;
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