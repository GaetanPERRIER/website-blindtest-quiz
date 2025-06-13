<script setup>

defineProps({
    cardInfoData : Object
})

</script>

<template>

<div class="card-info u-flex u-flex-direction-column u-align-items-center u-justify-content-center u-gap25">
    <div class="title-container u-flex u-align-items-center u-justify-content-center u-gap10 w100">
        <img :src="cardInfoData.cardInfoIconPath" alt="icon-cofee">
        <h3 class="t-title t-color-white">{{ cardInfoData.cardInfoTitle }}</h3>
    </div>
    <p class="card-content t-body-text t-color-white ">{{ cardInfoData.cardInfoContent }}</p>
    <button class="t-body-text">{{ cardInfoData.cardInfoButtonLabel }}</button>
</div>

</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

.card-info {
    width: 400px;
    height: fit-content;
    border-radius: 15px;
    background-color: rgba(255,255,255,0.1);
    border: 2px solid rgba(255,255,255,0.3);
    padding: 50px;

    .title-container {
        img {
            width: 45px;
        }
    }

    button {
        padding: 10px 25px;
        background-color: $major-yellow-color;
        border-radius: 10px;
        font-size: 16px;
        width: fit-content;
    }
}


</style>