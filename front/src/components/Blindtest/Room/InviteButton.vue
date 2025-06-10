<script setup>

import {computed, onMounted} from "vue";
import {usePlayerStore} from "@/stores/playerStore.js";

const playerStore = usePlayerStore();


function CopyLink() {
    const inviteUrl = `${window.location.origin}/blindtest?roomId=${playerStore.player.roomId}`;
    navigator.clipboard.writeText(inviteUrl).then(() => {
        alert("Lien copié dans le presse-papiers !");
    }).catch(err => {
        console.error('Erreur lors de la copie du lien : ', err);
    });
}

</script>

<template>
    <button @click="CopyLink" class="invite-button t-body-text">Inviter</button>
</template>

<style scoped lang="scss">
@import '@/assets/styles/settings/settings.scss';

.invite-button {
    padding: 5px 15px;
    font-size: 18px;
    background-color: $major-yellow-color;
    border-radius: 10px;
    cursor: pointer;
    transition: all 200ms $authenticMotion;

    &:hover {
        background-color: darken($major-yellow-color, 10%);
        transform: scale(1.05);
    }
}

</style>