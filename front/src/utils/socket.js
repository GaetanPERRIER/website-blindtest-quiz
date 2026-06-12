// socket.js
import { io } from "socket.io-client";
import { supabase } from "../services/supabase";

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:3001", {
    auth: async (cb) => {
        const { data: { session } } = await supabase.auth.getSession();
        cb({
            token: session?.access_token
        });
    }
});

export default socket;