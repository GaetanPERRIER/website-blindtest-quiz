<script setup>
import CardGame from "@/components/Home/Utils/CardGame.vue";

const cardMoreGames = [
    {
        imgPath: "/Home/Introduction/blindtest-image.png",
        cardTitle: "Quiz musical",
        cardContent: "Teste tes connaissances musicales"
    },
    {
        imgPath: "/Home/Introduction/blindtest-image.png",
        cardTitle: "Quiz musical",
        cardContent: "Teste tes connaissances musicales"
    },
    {
        imgPath: "/Home/Introduction/blindtest-image.png",
        cardTitle: "Quiz musical",
        cardContent: "Teste tes connaissances musicales"
    }
]

</script>

<template>
    <div class="more-games-container u-flex u-flex-direction-column u-align-items-center u-gap35 u-plr50">
        <h2 >Découvre plus de jeux</h2>
        <div class="cards-container">
            <CardGame v-for="card in cardMoreGames" :img-path="card.imgPath" :card-title="card.cardTitle" :card-content="card.cardContent"></CardGame>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

.more-games-container {
    h2 {
        font-size: 2.5rem;
        color: $major-yellow-color;
        text-align: center;
        position: relative;

        &::after {
            content: '';
            display: block;
            width: 100px;
            height: 3px;
            background: $major-yellow-color;
            margin: 20px auto 0;
        }
    }

    .cards-container {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 20px;
    }

    @media (max-width: 1000px) {
        .cards-container {
            grid-template-columns: 1fr 1fr;
        }
    }

    @media (max-width: 768px) {
        .more-games-container {
            padding: 0 20px;
        }
        .cards-container {
            grid-template-columns: 1fr;
        }
    }
}

</style>