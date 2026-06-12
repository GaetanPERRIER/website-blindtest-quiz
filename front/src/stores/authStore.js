import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '../services/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const session = ref(null)
  const loading = ref(true)

  const isAuthenticated = computed(() => !!user.value)

  async function initialize() {
    loading.value = true
    
    // Check active session
    const { data: { session: currentSession } } = await supabase.auth.getSession()
    session.value = currentSession
    user.value = currentSession?.user || null
    
    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, newSession) => {
      session.value = newSession
      user.value = newSession?.user || null
      loading.value = false
    })

    loading.value = false
  }

  async function signInWithGoogle() {
    if (!supabase.auth.signInWithOAuth) {
      console.error('Supabase is not configured. Google Sign-In is unavailable.')
      return
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })
    if (error) throw error
  }

  async function signOut() {
    if (!supabase.auth.signOut) {
      user.value = null
      session.value = null
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
    session.value = null
  }

  return {
    user,
    session,
    loading,
    isAuthenticated,
    initialize,
    signInWithGoogle,
    signOut
  }
})
