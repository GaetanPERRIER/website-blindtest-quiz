<script setup>
import {useMusicStore} from "~/stores/musics.js";

const musicStore = useMusicStore();

// Appeler directement le backend pour récupérer les playlists
const { data, error } = await useFetch('http://localhost:3001/api/deezer/get-categories', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

if (data.value) {
    console.log('Données:', data.value.playlists.data);
    musicStore.setBlindtestCategories(data.value.playlists.data);
} else {
    console.error('Erreur:', error.value);
}

// Variables calculées depuis le store
const blindtestCategories = computed(() => musicStore.blindtestCategories);

onMounted(() => {
    console.log("Component mounted : BlindtestCategories");
    console.log(blindtestCategories.value);
});

function startBlindtest () {
    console.log("startBlindtest");
}
</script>

<template>
    <div class="blindtest-categories">
        <h1 class="title-blindtest">Choisissez une catégorie de blindtest</h1>

        <div v-for="category in blindtestCategories">
            <div @click="startBlindtest" class="blindtest-category" :key="category.id">
                <img :src="category.picture_big" alt="Category Image" class="">
            </div>
        </div>
    </div>

</template>

<style scoped lang="scss">

.blindtest-categories {
    width: 40%;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 20px;

    .blindtest-category {
        cursor: pointer;
        width: 125px;
        height: fit-content;
        text-align: center;

        img {
            width: 100%;
            border-radius: 10px;
        }

        h2 {
            font-size: 16px;
            color: #fff;
            text-align: center;
            margin-top: 10px;
            width: 100%;
            height: 35px;
            overflow: hidden;
        }

    }
}
</style>