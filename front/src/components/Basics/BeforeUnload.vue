<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { usePlayerStore } from '@/stores/playerStore.js'
import socket from '@/utils/socket.js'

const playerStore = usePlayerStore()

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  window.addEventListener('unload', handleUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  window.removeEventListener('unload', handleUnload)
})

function handleBeforeUnload(event) {
  // Afficher une confirmation si le joueur est dans une room
  if (playerStore.room.id) {
    event.preventDefault()
    // Certains navigateurs ignorent le texte custom et affichent un message par défaut
    event.returnValue = "Vous êtes actuellement dans une partie. Voulez-vous vraiment quitter ?"
    return event.returnValue
  }
}

function handleUnload() {
  // Déconnecter proprement quand la page se ferme
  if (playerStore.room.id && socket.connected) {
    socket.disconnect()
  }
}
</script>

<template>
  <div>
  </div>
</template>
