<script setup>
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import ParticleBackground from "@/components/Basics/ParticleBackground.vue";
import { ref } from 'vue';

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);
const error = ref(null);

async function loginWithGoogle() {
    loading.value = true;
    error.value = null;
    try {
        await authStore.signInWithGoogle();
    } catch (err) {
        error.value = "Failed to connect with Google. Please try again.";
        console.error(err);
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <div class="page-container">
        <ParticleBackground />
        
        <main class="login-container">
            <div class="auth-card">
                <p class="t-body-text u-mb30 color-text-muted">You must be logged in to play and compete with your friends.</p>

                <button 
                    @click="loginWithGoogle" 
                    class="btn-primary google-btn"
                    :disabled="loading"
                >
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" class="google-icon">
                    {{ loading ? 'Connecting...' : 'Continue with Google' }}
                </button>

                <p v-if="error" class="error-message u-mt20">{{ error }}</p>
            </div>
        </main>
    </div>
</template>

<style lang="scss" scoped>
.login-container {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: $spacing-xl;
    text-align: center;
}

.auth-card {
    background: $color-surface;
    backdrop-filter: blur($blur-lg);
    border: 1px solid $color-border;
    border-radius: 24px;
    padding: $spacing-3xl;
    width: 100%;
    max-width: 450px;
    box-shadow: $shadow-xl;
}

.google-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $spacing-md;
    padding: $spacing-lg;
    font-weight: 600;
    
    .google-icon {
        width: 24px;
        height: 24px;
        background: white;
        border-radius: 4px;
        padding: 2px;
    }
}

.error-message {
    color: $color-danger;
    font-size: $font-size-sm;
}

.color-text-muted {
    color: $color-text-muted;
}
</style>
