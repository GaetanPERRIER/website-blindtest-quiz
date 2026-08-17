import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import {useAuthStore} from "@/stores/authStore.js";
import '@tabler/icons-webfont/dist/tabler-icons.css'

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

const authStore = useAuthStore(pinia)
await authStore.initialize()

app.mount('#app');
