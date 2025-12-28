// src/stores/auth.js
// Store Pinia pour gérer l'authentification
// npm install pinia

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(authService.getStoredUser())
  const token = ref(localStorage.getItem('token'))
  const loading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value)
  const userInitials = computed(() => {
    if (!user.value?.name) return 'U'
    const names = user.value.name.split(' ')
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase()
    }
    return user.value.name.substring(0, 2).toUpperCase()
  })

  // Actions
  const login = async (credentials) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await authService.login(credentials)
      user.value = response.data.user
      token.value = response.data.token
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const register = async (userData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await authService.register(userData)
      user.value = response.data.user
      token.value = response.data.token
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const logout = () => {
    authService.logout()
    user.value = null
    token.value = null
  }

  const fetchUser = async () => {
    if (!token.value) return
    
    loading.value = true
    try {
      const response = await authService.getMe()
      user.value = response.data.user
    } catch (err) {
      // Token invalide, déconnecter
      logout()
    } finally {
      loading.value = false
    }
  }

  const updateProfile = async (profileData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await authService.updateProfile(profileData)
      user.value = response.data.user
      localStorage.setItem('user', JSON.stringify(response.data.user))
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    user,
    token,
    loading,
    error,
    // Getters
    isAuthenticated,
    userInitials,
    // Actions
    login,
    register,
    logout,
    fetchUser,
    updateProfile
  }
})
