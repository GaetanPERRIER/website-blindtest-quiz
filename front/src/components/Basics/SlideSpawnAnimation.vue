<script setup>
const props = defineProps({
    transitionDuration: { type: String, default: '1000ms' },
    direction: {
        type: String,
        default: 'bottom',
        validator: (value) => ['top', 'bottom', 'left', 'right'].includes(value)
    }
})
</script>

<template>
    <Transition :name="`slide-${direction}`" :style="{ '--duration': props.transitionDuration }">
        <slot />
    </Transition>
</template>

<style scoped lang="scss">
/* Définition des animations pour chaque direction */
.slide-bottom {
    &-enter-active,
    &-leave-active {
        transition: transform var(--duration) $easeInOutExpo;
    }
    &-enter-from {
        transform: translateY(100%);
    }
    &-enter-to {
        transform: translateY(0);
    }
    &-leave-to {
        transform: translateY(100%);
    }
}

.slide-top {
    &-enter-active,
    &-leave-active {
        transition: transform var(--duration) $easeInOutExpo;
    }
    &-enter-from {
        transform: translateY(-100%);
    }
    &-enter-to {
        transform: translateY(0);
    }
    &-leave-to {
        transform: translateY(-100%);
    }
}

.slide-left {
    &-enter-active,
    &-leave-active {
        transition: transform var(--duration) $easeInOutExpo;
    }
    &-enter-from {
        transform: translateX(-100%);
    }
    &-enter-to {
        transform: translateX(0);
    }
    &-leave-to {
        transform: translateX(-100%);
    }
}

.slide-right {
    &-enter-active,
    &-leave-active {
        transition: transform var(--duration) $easeInOutExpo;
    }
    &-enter-from {
        transform: translateX(100%);
    }
    &-enter-to {
        transform: translateX(0);
    }
    &-leave-to {
        transform: translateX(100%);
    }
}
</style>