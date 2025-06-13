<script setup>

defineProps({
    imgPath : String,
    cardTitle : String,
    cardContent: String
})

</script>

<template>
    <div class="card-game u-flex u-flex-direction-column u-justify-content-center u-align-items-center u-p50 u-gap35">
        <img :src="imgPath" alt="">
        <div class="u-flex-direction-column u-flex u-gap5">
            <h2 class="t-title">{{ cardTitle }}</h2>
            <p class="t-body-text"> {{ cardContent }}</p>
        </div>
    </div>
</template>

<style scoped lang="scss">

.card-game {
    width: 100%;
    max-width: 350px;
    background-color: rgba(255, 255, 255, 0.4);
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-radius: 15px;
    text-align: center;

    img {
        width: 200px;
    }
}

@media (max-width: 450px) {
    .card-game {
        padding: 35px 50px !important;
    }
}

</style>