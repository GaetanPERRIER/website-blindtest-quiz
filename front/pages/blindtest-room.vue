<script setup>
import { useMusicStore } from "~/stores/musics.js";
import { useRouter } from 'vue-router';

const router = useRouter();
const musicStore = useMusicStore();

// Sur cette url : https://api.deezer.com/chart, récuperer les playists et faire une
// categorie pour chaque playlist

const proxy = `/api/deezer`;
const url = "https://api.deezer.com/chart";

const { data, error } = await useFetch(proxy, {
    query : {q: url}
})

if (data.value) {
    console.log('Données:', data.value.playlists.data)
    musicStore.setBlindtestCategories(data.value.playlists.data)
} else {
    console.error('Erreur:', error.value)
}

// Variables calculées depuis le store
const blindtestCategories = computed(() => musicStore.blindtestCategories);


async function startBlindtest(urlTracklist) {
    // Faire l'appel api sur la playlist (url de la tracklist dans la playlist)
    // recupérer les musiques et faire un random pour la partie
    let musics = [];
    let hasNext = true;
    const proxy = `/api/deezer`;
    let url = urlTracklist;

    while (hasNext) {
        const { data, error } = await useFetch(proxy, {
            query : {q: url}
        })

        if (error.value) {
            console.error('Erreur:', error.value)
        } else {
            musics.push(...data.value.data)
        }

        data.value.next ? url = data.value.next : hasNext = false
    }

    musicStore.addMusics(SelectRandomMusics(musics));
    musicStore.startGame();
    await router.push({name: 'blindtest'});
}

function SelectRandomMusics(musics, nbMusics = 10) {
    const randomMusics = [];
    const musicsCopy = [...musics];
    const randomIndexes = new Set();
    while (randomIndexes.size < nbMusics && randomIndexes.size < musicsCopy.length) {
        const randomIndex = Math.floor(Math.random() * musicsCopy.length);
        if (!randomIndexes.has(randomIndex)) {
            randomIndexes.add(randomIndex);
            randomMusics.push(musicsCopy[randomIndex]);
        }
    }
    console.log("Musics to guess", randomMusics);
    return randomMusics;
}

onMounted(() => {
    console.log("Component mounted");
    console.log(blindtestCategories.value);
});

</script>

<template>
    <div class="blindtest-room u-p20 u-flex u-justify-content-center u-align-items-center">
        <div class="blindtest-categories u-flex u-gap10">
            <div v-for="category in blindtestCategories">
                <div @click="startBlindtest(category.tracklist)" class="blindtest-category" :key="category.id">
                    <img :src="category.picture_big" alt="Category Image" class="">
                    <h2>{{ category.title }}</h2>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

.blindtest-room {
    width: 100vw;
    height: 100vh;

    .blindtest-categories {
        width: 90%;
        flex-wrap: wrap;

        .blindtest-category {
            cursor: pointer;
            width: 175px;
            height: fit-content;
            text-align: center;

            img {
                width: 150px;
                border-radius: 10px;
            }

        }

        .blindtest-category:hover {
            transform: scale(1.05);
            transition: all 0.3s;
        }
    }
}



</style>