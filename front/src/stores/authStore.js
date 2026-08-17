import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/auth.service'

const TOKEN_KEY = 'auth_token'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(null)
  const user = ref(null)
  const loading = ref(true)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.role === 'Admin')

    async function initialize() {
        loading.value = true

        const storedToken = localStorage.getItem(TOKEN_KEY)
        if (storedToken) {
                try {
                    await setSession(storedToken)
                } catch {
                    clearSession()
            }
        }
        loading.value = false
    }

  async function setSession(newToken) {
    const profile = await authService.fetchMe(newToken)
    token.value = newToken
    user.value = profile
    localStorage.setItem(TOKEN_KEY, newToken)
  }

  function clearSession() {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
  }

  function signInWithGoogle() {
    window.location.href = authService.getGoogleLoginUrl()
  }

  async function signOut() {
    if (token.value) {
      try {
        await authService.logout(token.value)
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }
    clearSession()
  }

  return {
    token,
    user,
    loading,
    isAuthenticated,
    isAdmin,
    initialize,
    setSession,
    clearSession,
    signInWithGoogle,
    signOut
  }
})
