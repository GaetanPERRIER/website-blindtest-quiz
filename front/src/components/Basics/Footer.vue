<script setup>

</script>

<template>
    <footer class="footer u-flex u-flex-direction-column u-align-items-center u-justify-content-center">
        <div class="w100 u-flex u-justify-content-around u-flex-direction-column--s u-gap35--s">
            <div class="u-flex u-flex-direction-row--s u-flex-direction-column u-justify-content-center u-align-items-center u-gap15">
                <a class="t-body-text t-color-white" href="">Accueil</a>
                <a class="t-body-text t-color-white" href="">Jouer</a>
                <a class="t-body-text t-color-white" href="">Contact</a>
            </div>
            <div class="u-flex u-justify-content-center u-align-items-center u-flex-direction-column u-gap15">
                <div class="u-flex u-align-items-center u-justify-content-center u-gap10">
                    <img src="/Footer/discord.png" alt="">
                    <img src="/Footer/X.png" alt="">
                    <img src="/Footer/instagram.png" alt="">
                </div>
                <p class="t-body-text t-color-white">email.example@gmail.com</p>
            </div>
            <div class="u-flex u-justify-content-center u-align-items-center t-body-text t-color-white">
                Musiques utilisées : Deezer API
            </div>
        </div>
    </footer>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

.footer {
    gap: 100px;
    padding: 100px 55px;
    background-color: rgba(255, 255, 255, 0.1);
    border-top: 2px solid rgba(255, 255, 255, 0.2);

    a {
        text-decoration: none;
        transition: all 200ms $authenticMotion;
        font-size: 16px;

        &:hover {
            color: $major-blue-color;
        }
    }

    div, p{
        font-size: 16px;
    }
}

@media (max-width: 1000px) {
    .footer {
        padding: 75px 35px;
        gap: 50px;

        div, p {
            font-size: 14px;
        }
    }
}


</style>