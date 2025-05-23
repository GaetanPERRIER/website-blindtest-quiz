<script setup>
import {useMusicStore} from "~/stores/musics.js";
import socket from "~/utils/socket.js";


const musicStore = useMusicStore();
const playerStore = usePlayerStore();

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
const currentPlayer = computed(() => playerStore.player);
const room = computed(() => playerStore.room);

onMounted(() => {


});

function selectCategory (event, category) {
    const categories = document.querySelectorAll(".blindtest-category .opacity-filter");
    categories.forEach(category => {
        category.style.opacity = "1";
    });
    event.target.style.opacity = "0";
    socket.emit("select category", room.value.id, category);

}
</script>

<template>
    <div v-if="currentPlayer.host" class="blindtest-categories">
        <input type="text" class="search-bar" placeholder="Search for a category...">
        <div class="categories-container">
            <div v-for="category in blindtestCategories">
                <div @click="selectCategory($event, category)" class="blindtest-category" :key="category.id">
                    <img :src="category.picture_big" alt="Category Image" class="">
                    <div class="opacity-filter"></div>
                </div>
            </div>
        </div>
    </div>

    <div v-else class="blindtest-categories">
        <img v-if="room && room.category" :src="room.category.picture_big" alt="" class="choosen-catedory">
        <h1 v-else>En attente de l'hôte...</h1>
    </div>

</template>

<style scoped lang="scss">

.blindtest-categories{
    width: 100%;
    height: 100%;
    gap: 1.041666666666667vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    padding: 1.041666666666667vw;

    .search-bar {
        width: 100%;
        background-color: #fff;
        height: 4.62962962962963vh;
        border-radius: 1.302083333333333vw;
        border: none;
        padding: 0.9259259259259259vh 1.041666666666667vw;
        font-size: 0.8333333333333333vw;


        &:focus {
            outline: none;
        }
    }

    h1 {
        font-size: 1.5625vw;
        color: #fff;
        text-align: center;
        margin-top: 20px;
        width: 100%;
        height: 35px;
        overflow: hidden;
    }

    .categories-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        height: 100%;
        overflow: scroll;
        gap:1.041666666666667vw;
        overflow: auto; /* ou scroll */
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none;  /* IE et Edge */
    }

    .categories-container::-webkit-scrollbar {
        display: none; /* Chrome, Safari et Opera */
    }

    .blindtest-category {
        cursor: pointer;
        width: 6.510416666666667vw;
        height: 6.5104166667vw;
        text-align: center;
        position: relative;

        .opacity-filter {
            opacity: 0;
            transition: opacity 0.3s ease;
            position: absolute;
            top: 0;
            left: 0;
            width: 6.510416666666667vw;
            height: 6.510416666666667vw;
            background-color: rgba(0, 0, 0, 0.75);
            border-radius: 0.5208333333333333vw;
            z-index: 1;
        }

        img {
            width: 100%;
            border-radius: 0.5208333333333333vw;
        }

        h2 {
            font-size: 16px;
            color: #fff;
            text-align: center;
            margin-top: 10px;
            width: 100%;
            height: 35px;
        }
    }

    .choosen-catedory {
        width: 400px;
        height: 400px;
        border-radius: 10px;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
    }
}
</style>