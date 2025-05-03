<script setup>

</script>

<template>
    <div class="audio-visualizer">
        <div v-for="i in 20" :key="'bar-'+i" class="visual-bar"
             :style="{ animationDelay: i * 0.05 + 's' }">
        </div>
    </div>
</template>

<style scoped lang="scss">

@keyframes visualizer {
    0%, 100% { height: 10px; }
    50% { height: 50px; }
}

.audio-visualizer {
    width: 100%;
    height: 100px;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 2px;
    padding: 20px;
    z-index: 0;

    .visual-bar {
        width: 4px;
        height: 10px;
        background: linear-gradient(to top, #00dbde, #fc00ff);
        border-radius: 2px;
        animation: visualizer 1.5s ease-in-out infinite;
    }
}
</style>