import { io } from "socket.io-client";
import { getActivePinia } from "pinia";
import { useAuthStore } from "@/stores/authStore";

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3001", {
    auth: (cb) => {
        const pinia = getActivePinia();
        const token = pinia ? useAuthStore(pinia).token : null;
        cb({ token: token || undefined });
    }
});

export default socket;
