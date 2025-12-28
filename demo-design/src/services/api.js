// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('daftlink_token') // ← Changé ici
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Erreur serveur')
    }

    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

export const authService = {
  register: async (userData) => {
    const data = await request('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
    if (data.data?.token) {
      localStorage.setItem('daftlink_token', data.data.token)  // ← Changé
      localStorage.setItem('daftlink_user', JSON.stringify(data.data.user))  // ← Changé
    }
    return data
  },

  login: async (credentials) => {
    const data = await request('/users/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    if (data.data?.token) {
      localStorage.setItem('daftlink_token', data.data.token)  // ← Changé
      localStorage.setItem('daftlink_user', JSON.stringify(data.data.user))  // ← Changé
    }
    return data
  },

  logout: () => {
    localStorage.removeItem('daftlink_token')  // ← Changé
    localStorage.removeItem('daftlink_user')   // ← Changé
  },

  getMe: async () => {
    return await request('/users/me')
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('daftlink_token')  // ← Changé
  },

  getStoredUser: () => {
    const user = localStorage.getItem('daftlink_user')  // ← Changé
    return user ? JSON.parse(user) : null
  }
}

export const chainService = {
  getChains: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return await request(`/chains?${queryString}`)
  },

  createChain: async (chainData) => {
    return await request('/chains', {
      method: 'POST',
      body: JSON.stringify(chainData)
    })
  },

  updateChain: async (id, chainData) => {
    return await request(`/chains/${id}`, {
      method: 'PUT',
      body: JSON.stringify(chainData)
    })
  },

  deleteChain: async (id) => {
    return await request(`/chains/${id}`, {
      method: 'DELETE'
    })
  }
}

export default { authService, chainService }