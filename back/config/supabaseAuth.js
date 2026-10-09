const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Client dedie au flux OAuth : exchangeCodeForSession stocke la session de l'utilisateur
// dans le client, qui envoie ensuite son JWT a la place de la cle service_role.
// Le garder separe du client de config/db.js evite que les requetes serveur passent sous la RLS.
const supabaseAuth = (supabaseUrl && supabaseServiceRoleKey)
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            flowType: 'pkce',
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false
        }
    })
    : null;

module.exports = supabaseAuth;
