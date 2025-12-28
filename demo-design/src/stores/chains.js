// src/stores/chains.js
// Store Pinia pour gérer les chaînes

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { chainService } from '@/services/api'

export const useChainsStore = defineStore('chains', () => {
  // State
  const chains = ref([])
  const currentChain = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })

  // Getters
  const activeChains = computed(() => 
    chains.value.filter(c => c.status === 'active')
  )
  
  const draftChains = computed(() => 
    chains.value.filter(c => c.status === 'draft')
  )

  const totalStats = computed(() => {
    return chains.value.reduce((acc, chain) => ({
      views: acc.views + (chain.stats?.views || 0),
      clicks: acc.clicks + (chain.stats?.clicks || 0),
      revenue: acc.revenue + (chain.stats?.revenue || 0)
    }), { views: 0, clicks: 0, revenue: 0 })
  })

  // Actions
  const fetchChains = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await chainService.getChains(params)
      chains.value = response.data.chains
      pagination.value = response.data.pagination
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchChain = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await chainService.getChain(id)
      currentChain.value = response.data.chain
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const createChain = async (chainData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await chainService.createChain(chainData)
      chains.value.unshift(response.data.chain)
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateChain = async (id, chainData) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await chainService.updateChain(id, chainData)
      const index = chains.value.findIndex(c => c._id === id)
      if (index !== -1) {
        chains.value[index] = response.data.chain
      }
      if (currentChain.value?._id === id) {
        currentChain.value = response.data.chain
      }
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteChain = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      await chainService.deleteChain(id)
      chains.value = chains.value.filter(c => c._id !== id)
      if (currentChain.value?._id === id) {
        currentChain.value = null
      }
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const duplicateChain = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await chainService.duplicateChain(id)
      chains.value.unshift(response.data.chain)
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const reorderChains = async (chainIds) => {
    try {
      await chainService.reorderChains(chainIds)
      // Réorganiser localement
      const reordered = chainIds.map(id => 
        chains.value.find(c => c._id === id)
      ).filter(Boolean)
      chains.value = reordered
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  return {
    // State
    chains,
    currentChain,
    loading,
    error,
    pagination,
    // Getters
    activeChains,
    draftChains,
    totalStats,
    // Actions
    fetchChains,
    fetchChain,
    createChain,
    updateChain,
    deleteChain,
    duplicateChain,
    reorderChains
  }
})
