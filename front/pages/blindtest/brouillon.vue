<script setup>
import { useMusicStore } from "~/stores/musics.js";
import { useRouter } from 'vue-router';

const router = useRouter();
const musicStore = useMusicStore();


onMounted(() => {
    console.log("Component mounted");
});

// Fait un call API au back, récupère la liste des musiques de la playlist pour jouer
async function startBlindtest(urlTracklist) {
    const url = "http://localhost:3001/api/deezer/start-blindtest";
    const { data, error } = await useFetch(url, {
        method: 'POST',
        body: {
            urlTracklist: urlTracklist
        }
    });

    if (error.value) {
        console.error('Erreur:', error.value);
    } else {
        console.log('Données:', data.value);
        musicStore.addMusics(data.value.musics);
        musicStore.startGame();
        await router.push({ name: 'blindtest' });
    }
}


/*
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

function SelectRandomMusics(musics, nbMusics = 3) {
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
*/




</script>

<template>
    <div class="blindtest-room u-p20 u-flex u-justify-content-center u-align-items-center u-gap25">

    </div>
    <ParticleBackground/>
</template>

<style scoped lang="scss">

.blindtest-room {
    width: 100vw;
    height: 100vh;

    .title-blindtest {
        font-size: 40px;
        color: #fff;
        text-align: center;
        margin-bottom: 40px;
    }

    .room-setting {
        width: 40%;
        height: 40%;
        background-color: rgba(0, 0, 0, 0.5);
    }


}



</style>