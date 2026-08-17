<script setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import ParticleBackground from '@/components/Basics/ParticleBackground.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
    const token = route.query.token;

    if (!token || typeof token !== 'string') {
        router.replace('/login?error=missing_token');
        return;
    }

    try {
        await authStore.setSession(token);
        router.replace('/');
    } catch (error) {
        console.error(error);
        authStore.clearSession();
        router.replace('/login?error=auth_failed');
    }
});
</script>

<template>
    <div class="page-container">
        <main class="callback-container">
            <p class="t-body-text color-text-muted">Signing you in...</p>
        </main>
    </div>
</template>

<style lang="scss" scoped>
.callback-container {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
}

.color-text-muted {
    color: $color-text-muted;
}
</style>
