import { createRouter, createWebHistory } from 'vue-router';
import Home from "@/views/home.vue";
import Create from "@/views/blindtest/create.vue";
import BlindtestPlay from "@/views/blindtest/play.vue";
import Dashboard from "@/views/profile/Dashboard.vue";
import { useAuthStore } from '@/stores/authStore';

const routes = [
    { path: '/', name: 'Home', component: Home, meta: { requiresAuth: false } },
    { path: '/create', name: 'Create', component: Create, meta: { requiresAuth: true } },
    { path: '/play', name: 'BlindtestPlay', component: BlindtestPlay, meta: { requiresAuth: true } },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    
    // Attendre que l'initialisation soit terminée si elle est en cours
    if (authStore.loading) {
        // Simple mécanisme d'attente
        await new Promise(resolve => {
            const unwatch = authStore.$subscribe((mutation, state) => {
                if (!state.loading) {
                    unwatch();
                    resolve();
                }
            });
            // Sécurité si déjà chargé
            if (!authStore.loading) {
                unwatch();
                resolve();
            }
        });
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        next('/login');
    } else if (to.name === 'Login' && authStore.isAuthenticated) {
        next('/');
    } else {
        next();
    }
});

export default router;
