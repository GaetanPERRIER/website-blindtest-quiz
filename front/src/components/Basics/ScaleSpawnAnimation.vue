<script setup>

// Props (Animation settings)
const props = defineProps({
    transitionDuration : {type: String, default: '1000ms'}, // duration value with units, example: '1000ms' or '1s'
    rotate : {type: Boolean, default: true} // set if the animation include rotation on Z axis
})

</script>

<template>
    <Transition :name="props.rotate ? 'scale-rotate' : 'scale'" :style="{ '--duration': props.transitionDuration }">
        <slot />
    </Transition>
</template>

<style scoped lang="scss">

.scale-enter-active, .scale-leave-active {
    transition: transform var(--duration) $easeInOutExpo; // easing fonction personnalisée
}
.scale-enter-from, .scale-leave-to {
    transform: scale(0);
}

.scale-rotate-enter-active, .scale-rotate-leave-active {
    transition: transform var(--duration) $easeInOutExpo; // easing fonction personnalisée
}
.scale-rotate-enter-from, .scale-rotate-leave-to {
    transform: scale(0) rotateZ(90deg);
}

</style>
