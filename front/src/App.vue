<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/authStore'
import Toast from './components/Basics/Toast.vue'
import ParticleBackground from "@/components/Basics/ParticleBackground.vue";
import TopNav from "@/components/Basics/TopNav.vue";

const authStore = useAuthStore()

onMounted(() => {
  authStore.initialize()
})
</script>

<template>
    <TopNav />
    <router-view />
    <Toast />
    <ParticleBackground/>
</template>
