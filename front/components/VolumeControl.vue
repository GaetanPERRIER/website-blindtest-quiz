<script setup>
const audioVolume = ref(0.05)

function updateVolume(event) {
    const audioElement = document.querySelector("audio");
    audioVolume.value = event.target.value;
    if (audioElement) {
        audioElement.volume = audioVolume.value;
    }
}

</script>

<template>
    <div class="volume-control">
        <label for="volume-slider">Volume</label>
        <input id="volume-slider" type="range" min="0" max="1" step="0.01" v-model="audioVolume" @input="updateVolume"/>
    </div>
</template>

<style scoped lang="scss">
.volume-control {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    padding: 10px 15px;
    border-radius: 20px;
    z-index: 10;

    label {
        color: white;
        font-weight: bold;
    }

    input[type="range"] {
        width: 150px;
    }
}
</style>