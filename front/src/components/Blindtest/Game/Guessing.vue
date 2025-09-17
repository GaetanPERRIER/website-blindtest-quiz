<script setup>
import {usePlayerStore} from "@/stores/playerStore.js";
import {computed, ref, onMounted} from "vue";
import InputAnswer from "@/components/Blindtest/Game/Playing/InputAnswer.vue";


/* Variables */
const playerStore = usePlayerStore();
const room = computed(() => playerStore.room);
const musicToGuess = computed(() => playerStore.room.currentMusic);
const audioVolume = ref(0.01);

</script>


<template>
    <div class="musicToDisplay">
        <audio :src="musicToGuess.preview" controls autoplay :volume="audioVolume/2"></audio>
    </div>

    <InputAnswer/>
</template>


<style scoped lang="scss">

</style>