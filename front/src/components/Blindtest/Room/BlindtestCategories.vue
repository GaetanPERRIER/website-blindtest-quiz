<script setup>

import Category from "@/components/Blindtest/Room/Utils/Category.vue";

import {useMusicStore} from "@/stores/musicStore.js";
import socket from "@/utils/socket.js";
import {computed, onMounted} from "vue";
import {usePlayerStore} from "@/stores/playerStore.js";


const musicStore = useMusicStore();
const playerStore = usePlayerStore();

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
            console.log('Données:', data.playlists.data);
            musicStore.setBlindtestCategories(data.playlists.data);
        } else {
            console.error('Erreur: Les données attendues ne sont pas disponibles.');
        }
    } catch (error) {
        console.error('Erreur:', error.message);
    }
});

// Variables calculées depuis le store
const blindtestCategories = computed(() => musicStore.blindtestCategories);
const currentPlayer = computed(() => playerStore.player);
const room = computed(() => playerStore.room);

</script>

<template>
    <div class="blindtest-categories w50 h100 u-flex-direction-column u-flex u-gap10 u-p10">
        <input class="search-bar t-color-white t-body-text w100" placeholder="Chercher une categorie...">
        <div class="categories w100 h100">
            <Category v-for="category in blindtestCategories" :img-path="category.picture_big" :name="category.title"/>
        </div>
    </div>
</template>

<style scoped lang="scss">

.blindtest-categories {

    input {
        background-color: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(0, 0, 0, 0.5);
        padding: 10px 25px;
        border-radius: 50px;
        font-size: 18px;

        &:focus {
            outline: none;
        }
    }

    .categories {
        padding: 10px 15px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(125px, 1fr));
        gap: 10px;
        height: 100%;
        overflow-y: auto;

        // décaler la scroll barre sur la droite
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
    }
}

</style>