<script setup>
import { onMounted, ref } from "vue";

// Props (Loading bar settings)
const props = defineProps({
    transitionDuration : {type: String, default: '5000ms'}, // duration value with units, example: '1000ms' or '1s'
    color : {type: String, default: '#fff'}, // hexadecimal code, example : #fff
    width : {type: String, default: '400px'} // width value, example : '400px' or '100%'
})

// References
const loadingBarRef = ref(null)

onMounted(() => {
    if (loadingBarRef.value) {
        loadingBarRef.value.style.setProperty('--transition-duration', props.transitionDuration);
        loadingBarRef.value.style.setProperty('--loading-bar-color', props.color);

        setTimeout(() => {
            loadingBarRef.value.style.setProperty('--progress-width', '100%');
        }, 1)

        loadingBarRef.value.addEventListener("transitionend", () => {
            loadingBarRef.value.style.opacity = '0'
        })
    }
})

</script>

<template>
    <div ref="loadingBarRef" class="vuews-loading-bar" :style="{width: width}"></div>
</template>

<style scoped lang="scss">

.vuews-loading-bar {
    position: relative;
    transition : opacity 200ms linear;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;

        width: 100%;
        height: 8px;

        background-color: var(--loading-bar-color);
        opacity: 10%;
        border-radius: 15px;
    }

    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;

        width: var(--progress-width, 0%);
        height: 8px;

        background-color: rgba(255, 255, 255, 0.9);
        border-radius: 15px;

        transition: var(--transition-duration) linear; /* Use dynamic duration */
    }
}

</style>