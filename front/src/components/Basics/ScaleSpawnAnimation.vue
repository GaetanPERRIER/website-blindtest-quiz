<script setup>
import { onMounted, ref } from 'vue';

// Props (Animation settings)
const props = defineProps({
    transitionDuration : {type: String, default: '1000ms'}, 
    rotate : {type: Boolean, default: true} 
})

// Nouvelle variable pour contrôler l'état de l'animation
const isSpawned = ref(false)

onMounted(() => {
    // Déclenche l'animation une fois que le composant est dans le DOM
    // Utilisez setTimeout si vous avez besoin de garantir que les classes sont appliquées
    setTimeout(() => {
        isSpawned.value = true
    }, 10); 
})
</script>

<template>
    <div :class="['spawn-wrapper', { 'is-spawned': isSpawned, 'with-rotate': props.rotate }]" :style="{ '--duration': props.transitionDuration }">
        <slot />
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss'; // Assurez-vous d'importer votre easing

.spawn-wrapper {
    /* État initial (comme un "enter-from") */
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transform: scale(0);
    opacity: 0;
    transition: transform var(--duration) $easeInOutExpo, opacity var(--duration) $easeInOutExpo;

    /* Gérer la rotation si la prop est activée */
    &.with-rotate {
        transform: scale(0) rotateZ(90deg);
    }
}

.spawn-wrapper.is-spawned {
    /* État final (comme un "enter-to") */
    transform: scale(1) rotateZ(0deg);
    opacity: 1;
}
</style>