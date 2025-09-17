import { createRouter, createWebHistory } from 'vue-router';
import Home from "@/views/blindtest/create.vue";
import BlindtestPlay from "@/views/blindtest/play.vue";

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/play', name: 'BlindtestPlay', component: BlindtestPlay },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
