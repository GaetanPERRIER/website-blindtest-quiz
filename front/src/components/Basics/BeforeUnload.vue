<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

function handleBeforeUnload(event) {
  event.preventDefault()
  // Certains navigateurs ignorent le texte custom et affichent un message par défaut
  event.returnValue = "Voulez-vous vraiment quitter cette page ?"
}
</script>

<template>
  <div>
  </div>
</template>
