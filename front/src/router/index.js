import { createRouter, createWebHistory } from 'vue-router';
import Home from "@/views/home.vue";
import Create from "@/views/blindtest/create.vue";
import BlindtestPlay from "@/views/blindtest/play.vue";
import Dashboard from "@/views/profile/Dashboard.vue";
import Login from "@/views/auth/login.vue";
import Callback from "@/views/auth/Callback.vue";
import Backoffice from "@/views/admin/Backoffice.vue";
import { useAuthStore } from '@/stores/authStore';

const routes = [
    { path: '/', name: 'Home', component: Home, meta: { requiresAuth: false } },
    { path: '/login', name: 'Login', component: Login, meta: { requiresAuth: false } },
    { path: '/auth/callback', name: 'AuthCallback', component: Callback, meta: { requiresAuth: false } },
    { path: '/create', name: 'Create', component: Create, meta: { requiresAuth: true } },
    { path: '/play', name: 'BlindtestPlay', component: BlindtestPlay, meta: { requiresAuth: true } },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
    { path: '/admin', name: 'Backoffice', component: Backoffice, meta: { requiresAuth: true, requiresAdmin: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();

    if (authStore.loading) {
        await new Promise(resolve => {
            const unwatch = authStore.$subscribe((mutation, state) => {
                if (!state.loading) {
                    unwatch();
                    resolve();
                }
            });
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
    } else if (to.meta.requiresAdmin && authStore.user?.role !== 'Admin') {
        next('/');
    } else {
        next();
    }
});

export default router;
