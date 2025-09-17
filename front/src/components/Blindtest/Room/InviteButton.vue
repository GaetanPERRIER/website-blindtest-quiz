<script setup>

import {usePlayerStore} from "@/stores/playerStore.js";
import {computed} from "vue";
import socket from "@/utils/socket.js";

const playerStore = usePlayerStore();
const currentPlayer = computed(() =>
    playerStore.room.players.find(player => player.socketId === socket.id)
)

function CopyLink() {
    console.log(socket.id)
    const inviteUrl = `${window.location.origin}?roomId=${currentPlayer.value.roomId}`;
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
    display: flex;
    align-items: center;
    gap: 10px;
    background: linear-gradient(135deg, #FF6E6E 0%, #FFDF6B 100%);
    color: #fff;
    padding: 8px 25px;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 400;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
    font-size: 18px !important;
    box-shadow: 0 4px 15px rgba(255, 110, 110, 0.4);

    &:hover {
        transform: translateY(-3px) scale(1.05);
        box-shadow: 0 6px 20px rgba(255, 110, 110, 0.6);
    }
}

</style>