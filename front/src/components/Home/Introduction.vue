<script setup>
import CardGame from "@/components/Home/Utils/CardGame.vue";

const cardIntro = {
    imgPath: "/Home/Introduction/blindtest-image.png",
    cardTitle: "Blindtest",
    cardContent: "Teste tes connaissances musicales"
}

</script>

<template>
    <section class="introdution-container u-flex u-align-items-center u-justify-content-center u-flex-direction-column--s u-gap50">
        <CardGame :img-path="cardIntro.imgPath" :card-title="cardIntro.cardTitle" :card-content="cardIntro.cardContent"/>
        <div class="content-intro u-flex u-flex-direction-column u-align-items-center u-justify-content-center u-gap10">
            <div class="content-intro-title u-flex u-justify-content-center u-align-items-center u-gap15">
                <h2 class="t-title">Il est l'heure maestro</h2>
                <img class="u-none" src="/Home/Introduction/clock-icon.png" alt="">
            </div>
            <p class="t-body-text t-color-white">Seul ou entre amis, voyage à travers les styles et générations de musiques. Ici, pas besoins de s’abimer les cordes vocales pour répondre ! </p>
            <button class="cta-lets-go t-body-text u-mt10">C'est parti</button>
        </div>
    </section>

</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

.introdution-container {
    width: 100%;
    max-width: 1200px;
    padding: 0 100px;

    .content-intro {
        text-align: center;
        max-width: 600px;

        .content-intro-title {
            h2 {
                color: $major-yellow-color;
            }
        }

        .lines {
            padding-top: 10px;
            padding-bottom: 10px;

            .line {
                background-color: #fff;
                height: 2px;
            }

            .first-line {
                width: 175px;
                opacity: 75%;
            }

            .second-line {
                width: 125px;
                opacity: 50%;
            }

            .third-line{
                width: 75px;
                opacity: 25%;
            }
        }

        .cta-lets-go{
            background-color: $major-yellow-color;
            color: #fff;
            padding: 10px 25px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 200ms $authenticMotion;

            &:hover {
                transform: scale(1.1);
                background-color: darken($major-yellow-color, 10%);
            }
        }
    }
}

@media (max-width: 1000px) {
    .introdution-container {
        padding: 0 50px;

        .content-intro {
            max-width: 500px;
        }
    }
}

@media (max-width: 768px) {
    .introdution-container {
        padding: 0 20px;
    }
    .content-intro {
        padding: 0 10px;
    }
}

</style>