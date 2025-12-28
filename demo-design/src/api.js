// src/services/api.js
// Service API pour connecter le frontend au backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Helper pour les requêtes
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')
  
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

// ==================== AUTH ====================

export const authService = {
  // Inscription
  register: async (userData) => {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
    if (data.data?.token) {
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))
    }
    return data
  },

  // Connexion
  login: async (credentials) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    if (data.data?.token) {
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))
    }
    return data
  },

  // Déconnexion
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  // Obtenir le profil
  getMe: async () => {
    return await request('/auth/me')
  },

  // Mettre à jour le profil
  updateProfile: async (profileData) => {
    return await request('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    })
  },

  // Changer le mot de passe
  updatePassword: async (passwords) => {
    return await request('/auth/password', {
      method: 'PUT',
      body: JSON.stringify(passwords)
    })
  },

  // Stats utilisateur
  getStats: async () => {
    return await request('/auth/stats')
  },

  // Vérifier si connecté
  isAuthenticated: () => {
    return !!localStorage.getItem('token')
  },

  // Obtenir l'utilisateur stocké
  getStoredUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  }
}

// ==================== CHAINS ====================

export const chainService = {
  // Liste des chaînes
  getChains: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return await request(`/chains?${queryString}`)
  },

  // Détails d'une chaîne
  getChain: async (id) => {
    return await request(`/chains/${id}`)
  },

  // Créer une chaîne
  createChain: async (chainData) => {
    return await request('/chains', {
      method: 'POST',
      body: JSON.stringify(chainData)
    })
  },

  // Mettre à jour une chaîne
  updateChain: async (id, chainData) => {
    return await request(`/chains/${id}`, {
      method: 'PUT',
      body: JSON.stringify(chainData)
    })
  },

  // Supprimer une chaîne
  deleteChain: async (id) => {
    return await request(`/chains/${id}`, {
      method: 'DELETE'
    })
  },

  // Réorganiser les chaînes
  reorderChains: async (chainIds) => {
    return await request('/chains/reorder', {
      method: 'PUT',
      body: JSON.stringify({ chainIds })
    })
  },

  // Dupliquer une chaîne
  duplicateChain: async (id) => {
    return await request(`/chains/${id}/duplicate`, {
      method: 'POST'
    })
  },

  // Stats d'une chaîne
  getChainStats: async (id) => {
    return await request(`/chains/${id}/stats`)
  },

  // Chaînes publiques (par username)
  getPublicChains: async (username) => {
    return await request(`/chains/public/${username}`)
  },

  // Tracker une vue
  trackView: async (id) => {
    return await request(`/chains/${id}/view`, {
      method: 'POST'
    })
  },

  // Tracker un clic
  trackClick: async (id) => {
    return await request(`/chains/${id}/click`, {
      method: 'POST'
    })
  }
}

export default { authService, chainService }
