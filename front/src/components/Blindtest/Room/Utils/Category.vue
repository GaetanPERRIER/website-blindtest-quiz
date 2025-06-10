<script setup>

defineProps({
    imgPath:"",
    name:""
})

</script>

<template>
    <div class="category u-flex u-flex-direction-column u-align-items-center u-justify-content-center u-gap10">
        <img :src="imgPath" alt="">
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

.category {
    cursor: pointer;
    border-radius: 10px;
    transition: all 350ms $authenticMotion;
    box-shadow: rgba(0, 0, 0, 0.5) 0px 5px 15px;

    img {
        width: 100%;
        height: 100%;
        border-radius: 10px;
    }

    &:hover {
        border-radius: 10px;
        box-shadow: rgba(255, 255, 255, 0.5) 0px 5px 15px;
    }
}

</style>