<script setup>

import Category from "@/components/Blindtest/Room/Utils/Category.vue";

import {useMusicStore} from "@/stores/musicStore.js";
import {computed, onMounted} from "vue";
import {usePlayerStore} from "@/stores/playerStore.js";
import socket from "@/utils/socket.js";

const musicStore = useMusicStore();
const playerStore = usePlayerStore();

// Variables calculées depuis le store
const blindtestCategories = computed(() => musicStore.blindtestCategories);
const currentPlayer = computed(() =>
    playerStore.room.players.find(player => player.socketId === socket.id)
)
const room = computed(() => playerStore.room);

const hostPlayer = computed(() => {
    return room.value.players.find(player => player.host);
});


onMounted(async () => {
    try {
        const response = await fetch('http://localhost:3001/api/deezer/get-categories', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data?.playlists?.data) {
            musicStore.setBlindtestCategories(data.playlists.data);
        } else {
            console.error('Erreur: Les données attendues ne sont pas disponibles.');
        }
    } catch (error) {
        console.error('Erreur:', error.message);
    }
});

</script>

<template>
    <div v-if="currentPlayer && currentPlayer.host" class="blindtest-categories w65 h100 u-flex-direction-column u-flex u-gap10 u-p10">
        <input class="search-bar t-color-white t-body-text w100" placeholder="Chercher une categorie...">
        <div class="u-flex u-flex-direction-column u-gap25 global-categories-container">
            <!-- Créer un composant pour les tries de catégories -->
            <div class="u-flex u-flex-direction-column u-gap15 u-pt15">
                <div class="u-flex u-justify-content-between u-align-items-center u-pr15">
                    <h2 class="t-body-text t-color-white fs25px">Catégories populaires</h2>
                    <p class="t-body-text t-color-white categories-count"> {{ blindtestCategories.length }} disponibles </p>
                </div>
                <div class="categories w100">
                    <div v-for="category in blindtestCategories" class="category-container">
                        <Category  :category="category"/>
                    </div>
                </div>
            </div>
            <div class="u-flex u-flex-direction-column u-gap15">
                <div class="u-flex u-justify-content-between u-align-items-center u-pr15">
                    <h2 class="t-body-text t-color-white fs25px">Catégories test</h2>
                    <p class="t-body-text t-color-white categories-count"> {{ blindtestCategories.length }} disponibles </p>
                </div>
                <div class="categories w100">
                    <div v-for="category in blindtestCategories" class="category-container">
                        <Category  :category="category"/>
                    </div>
                </div>
            </div>
            <div class="u-flex u-flex-direction-column u-gap15">
                <div class="u-flex u-justify-content-between u-align-items-center u-pr15">
                    <h2 class="t-body-text t-color-white fs25px">Catégories test</h2>
                    <p class="t-body-text t-color-white categories-count"> {{ blindtestCategories.length }} disponibles </p>
                </div>
                <div class="categories w100">
                    <div v-for="category in blindtestCategories" class="category-container">
                        <Category  :category="category"/>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else class="blindtest-categories w50 u-flex-direction-column u-flex u-justify-content-center u-align-items-center u-gap20 u-p10">
        <h2 v-if="hostPlayer" class="t-body-text t-color-white">{{hostPlayer.username}} configure la partie...</h2>
        <img v-if="room.setting.category" :src="room.setting.category.picture_big" alt="En attente de l'hôte" class="w100 img-category">
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

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