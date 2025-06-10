<script setup>

</script>

<template>
    <nav class="u-flex u-align-items-center u-gap25">
        <img src="/Header/menu-hamburger.png" alt="hamb">
        <div class="links-container w100 u-flex u-justify-content-between">
            <img src="/Header/temp-logo.png" alt="logo">
            <a href="/blindtest" class="play-button u-flex u-justify-content-center u-align-items-center u-gap10">
                <img src="/Header/mirco-icon.png" alt="micro-icon">
                <span class="t-body-text">Jouer</span>
            </a>
        </div>
    </nav>
</template>

<style scoped lang="scss">
// importer les settings
@import '@/assets/styles/settings/settings.scss';

nav {
    position: absolute;
    top: 0;
    width: 100%;
    padding: 20px 35px !important;
    background-color: rgba(255, 255, 255, 0.1);
    border-bottom: 2px solid rgba(255, 255, 255, 0.5) !important;
    backdrop-filter: blur(5px);
    color: #fff;

    .links-container {

        .play-button {
            text-decoration: none;
            background-color: $major-blue-color;
            border-radius: 15px;
            padding: 10px 25px;
            font-size: 20px;
            cursor: pointer;
            transition: all 200ms $authenticMotion;
            color: #fff;

            &:hover {
                transform: scale(1.1);
                background-color: darken($major-blue-color, 10%);
            }
        }
    }
}

</style>