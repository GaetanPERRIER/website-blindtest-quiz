<script setup>

import {usePlayerStore} from "@/stores/playerStore.js";

const playerStore = usePlayerStore();


function CopyLink() {
    const inviteUrl = `${window.location.origin}/blindtest?roomId=${playerStore.player.roomId}`;
    navigator.clipboard.writeText(inviteUrl).then(() => {
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
    padding: 8px 20px;
    font-size: 18px !important;
    background-color: $major-yellow-color;
    border-radius: 10px;
    cursor: pointer;
    transition: all 200ms $authenticMotion;
    color: #fff;

    &:hover {
        background-color: darken($major-yellow-color, 10%);
        transform: scale(1.08);
    }
}

</style>