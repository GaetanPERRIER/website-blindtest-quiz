<script setup>

</script>

<template>
    <section class="banner-infos-container u-flex u-flex-direction-column u-gap20 u-align-items-center u-justify-content-center">
        <h2 class="t-title">Quiz musicaux et bien plus encore !</h2>
        <p class="t-body-text">Pour le moment seul des blindtests “classiques” sont disponible et jouables, cependant d’autres mini jeux dans l’univers de la musique sont à venir ainsi que quelques variantes du blindtest traditionnel. Alors reste connecté !</p>
        <p class="t-body-text"> Si tu as une quelconque proposition de jeu à ajouter, nous nous ferons un plaisir de la découvrir ! </p>
        <div class="cta-contact u-flex u-align-items-center u-gap10">
            <span class="t-body-text">Nous contacter</span>
            <img src="/Home/BannerInfos/icon-enveloppe.png" alt="">
        </div>
    </section>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

.banner-infos-container {
    height: 400px;
    width: 100%;
    background-color: rgba(255, 255, 255, 0.35);
    border-bottom: 1px solid rgba(255, 255, 255, 0.35);
    border-top: 1px solid rgba(255, 255, 255, 0.35);
    padding: 50px 175px;
    text-align: center;

    h2 {
        color: $major-blue-color;
        max-width: 800px;
    }

    p {
        max-width: 800px;
    }

    .cta-contact {
        padding: 15px 25px;
        background-color: $major-blue-color;
        color: #fff;
        border-radius: 10px;
        cursor: pointer;
        transition: all 200ms $authenticMotion;

        &:hover {
            transform: scale(1.1);
            background-color: darken($major-blue-color, 10%);
        }
    }
}

@media (max-width: 1000px) {
    .banner-infos-container {
        padding: 50px 100px;

        h2, p {
            max-width: 100%;
        }
    }
}

@media (max-width: 768px) {
    .banner-infos-container {
        padding: 30px 50px;
        height: 600px;

        h2, p {
            max-width: 100%;
        }
    }
}

@media (max-width: 400px) {
    .banner-infos-container {
        padding: 30px 50px;
        height: 650px;

        h2, p {
            max-width: 100%;
        }
    }
}

</style>