import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl === 'your_supabase_url' || supabaseAnonKey === 'your_supabase_anon_key') {
  console.warn('Supabase URL or Anon Key is missing or not configured in .env')
}

export const supabase = (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_url' && supabaseAnonKey !== 'your_supabase_anon_key') 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : { auth: { getSession: async () => ({ data: { session: null } }), onAuthStateChange: () => ({ data: { subscription: null } }) } }
