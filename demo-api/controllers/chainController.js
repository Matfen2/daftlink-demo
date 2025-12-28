import Chain from '../models/Chain.js'

// @desc    Obtenir toutes les chaînes de l'utilisateur
// @route   GET /api/chains
// @access  Private
export const getChains = async (req, res) => {
  try {
    const { status, sort = '-createdAt', page = 1, limit = 10 } = req.query

    // Filtres
    const filter = { user: req.user._id }
    if (status && status !== 'all') {
      filter.status = status
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)

    // Requête
    const chains = await Chain.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))

    // Total pour la pagination
    const total = await Chain.countDocuments(filter)

    res.json({
      success: true,
      data: {
        chains,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    })
  } catch (error) {
    console.error('Erreur getChains:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des chaînes'
    })
  }
}

// @desc    Obtenir une chaîne par ID
// @route   GET /api/chains/:id
// @access  Private
export const getChain = async (req, res) => {
  try {
    const chain = await Chain.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!chain) {
      return res.status(404).json({
        success: false,
        message: 'Chaîne non trouvée'
      })
    }

    res.json({
      success: true,
      data: { chain }
    })
  } catch (error) {
    console.error('Erreur getChain:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    })
  }
}

// @desc    Créer une nouvelle chaîne
// @route   POST /api/chains
// @access  Private
export const createChain = async (req, res) => {
  try {
    const {
      name,
      emoji,
      description,
      category,
      priceInitial,
      priceFinal,
      url,
      expiresInDays,
      maxParticipants,
      settings
    } = req.body

    // Vérifier les limites selon le plan
    const chainCount = await Chain.countDocuments({ user: req.user._id })
    const limits = {
      free: 3,
      pro: 20,
      enterprise: Infinity
    }

    if (chainCount >= limits[req.user.plan]) {
      return res.status(403).json({
        success: false,
        message: `Limite de chaînes atteinte pour le plan ${req.user.plan}. Passez au plan supérieur.`
      })
    }

    // Calculer la date d'expiration
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + (expiresInDays || 7))

    // Créer la chaîne
    const chain = await Chain.create({
      user: req.user._id,
      name,
      emoji: emoji || '🔗',
      description,
      category,
      priceInitial,
      priceFinal,
      url,
      expiresAt,
      expiresInDays: expiresInDays || 7,
      maxParticipants: maxParticipants || 100,
      settings,
      order: chainCount // Ordre par défaut
    })

    res.status(201).json({
      success: true,
      message: 'Chaîne créée avec succès',
      data: { chain }
    })
  } catch (error) {
    console.error('Erreur createChain:', error)

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      })
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la chaîne'
    })
  }
}

// @desc    Mettre à jour une chaîne
// @route   PUT /api/chains/:id
// @access  Private
export const updateChain = async (req, res) => {
  try {
    let chain = await Chain.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!chain) {
      return res.status(404).json({
        success: false,
        message: 'Chaîne non trouvée'
      })
    }

    const {
      name,
      emoji,
      description,
      category,
      priceInitial,
      priceFinal,
      url,
      expiresInDays,
      maxParticipants,
      status,
      settings
    } = req.body

    // Mettre à jour les champs
    if (name) chain.name = name
    if (emoji) chain.emoji = emoji
    if (description !== undefined) chain.description = description
    if (category) chain.category = category
    if (priceInitial) chain.priceInitial = priceInitial
    if (priceFinal) chain.priceFinal = priceFinal
    if (url) chain.url = url
    if (maxParticipants) chain.maxParticipants = maxParticipants
    if (status) chain.status = status
    if (settings) chain.settings = { ...chain.settings, ...settings }

    // Recalculer la date d'expiration si besoin
    if (expiresInDays) {
      chain.expiresInDays = expiresInDays
      chain.expiresAt = new Date()
      chain.expiresAt.setDate(chain.expiresAt.getDate() + expiresInDays)
    }

    await chain.save()

    res.json({
      success: true,
      message: 'Chaîne mise à jour',
      data: { chain }
    })
  } catch (error) {
    console.error('Erreur updateChain:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour'
    })
  }
}

// @desc    Supprimer une chaîne
// @route   DELETE /api/chains/:id
// @access  Private
export const deleteChain = async (req, res) => {
  try {
    const chain = await Chain.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    })

    if (!chain) {
      return res.status(404).json({
        success: false,
        message: 'Chaîne non trouvée'
      })
    }

    res.json({
      success: true,
      message: 'Chaîne supprimée'
    })
  } catch (error) {
    console.error('Erreur deleteChain:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression'
    })
  }
}

// @desc    Réorganiser les chaînes
// @route   PUT /api/chains/reorder
// @access  Private
export const reorderChains = async (req, res) => {
  try {
    const { chainIds } = req.body

    if (!Array.isArray(chainIds)) {
      return res.status(400).json({
        success: false,
        message: 'chainIds doit être un tableau'
      })
    }

    // Mettre à jour l'ordre de chaque chaîne
    const updatePromises = chainIds.map((id, index) => {
      return Chain.findOneAndUpdate(
        { _id: id, user: req.user._id },
        { order: index }
      )
    })

    await Promise.all(updatePromises)

    res.json({
      success: true,
      message: 'Ordre mis à jour'
    })
  } catch (error) {
    console.error('Erreur reorderChains:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réorganisation'
    })
  }
}

// @desc    Dupliquer une chaîne
// @route   POST /api/chains/:id/duplicate
// @access  Private
export const duplicateChain = async (req, res) => {
  try {
    const originalChain = await Chain.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!originalChain) {
      return res.status(404).json({
        success: false,
        message: 'Chaîne non trouvée'
      })
    }

    // Calculer nouvelle date d'expiration
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + originalChain.expiresInDays)

    // Créer la copie
    const newChain = await Chain.create({
      user: req.user._id,
      name: `${originalChain.name} (copie)`,
      emoji: originalChain.emoji,
      description: originalChain.description,
      category: originalChain.category,
      priceInitial: originalChain.priceInitial,
      priceFinal: originalChain.priceFinal,
      url: originalChain.url,
      expiresAt,
      expiresInDays: originalChain.expiresInDays,
      maxParticipants: originalChain.maxParticipants,
      settings: originalChain.settings,
      status: 'draft'
    })

    res.status(201).json({
      success: true,
      message: 'Chaîne dupliquée',
      data: { chain: newChain }
    })
  } catch (error) {
    console.error('Erreur duplicateChain:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la duplication'
    })
  }
}

// @desc    Obtenir les stats d'une chaîne
// @route   GET /api/chains/:id/stats
// @access  Private
export const getChainStats = async (req, res) => {
  try {
    const chain = await Chain.findOne({
      _id: req.params.id,
      user: req.user._id
    })

    if (!chain) {
      return res.status(404).json({
        success: false,
        message: 'Chaîne non trouvée'
      })
    }

    res.json({
      success: true,
      data: {
        stats: {
          ...chain.stats,
          conversionRate: chain.conversionRate,
          daysLeft: chain.daysLeft,
          participantsProgress: chain.maxParticipants > 0 
            ? ((chain.currentParticipants / chain.maxParticipants) * 100).toFixed(1)
            : 0
        }
      }
    })
  } catch (error) {
    console.error('Erreur getChainStats:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    })
  }
}

// @desc    Incrémenter les vues (public)
// @route   POST /api/chains/:id/view
// @access  Public
export const trackView = async (req, res) => {
  try {
    const chain = await Chain.findById(req.params.id)

    if (!chain || chain.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Chaîne non trouvée ou inactive'
      })
    }

    await chain.incrementViews()

    res.json({
      success: true,
      message: 'Vue enregistrée'
    })
  } catch (error) {
    console.error('Erreur trackView:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    })
  }
}

// @desc    Incrémenter les clics (public)
// @route   POST /api/chains/:id/click
// @access  Public
export const trackClick = async (req, res) => {
  try {
    const chain = await Chain.findById(req.params.id)

    if (!chain || chain.status !== 'active') {
      return res.status(404).json({
        success: false,
        message: 'Chaîne non trouvée ou inactive'
      })
    }

    await chain.incrementClicks()

    res.json({
      success: true,
      message: 'Clic enregistré',
      data: { url: chain.url }
    })
  } catch (error) {
    console.error('Erreur trackClick:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    })
  }
}

// @desc    Obtenir les chaînes publiques d'un utilisateur (par username)
// @route   GET /api/chains/public/:username
// @access  Public
export const getPublicChains = async (req, res) => {
  try {
    // Importer User
    const User = (await import('../models/User.js')).default

    const user = await User.findOne({ username: req.params.username })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      })
    }

    const chains = await Chain.find({
      user: user._id,
      status: 'active',
      'settings.isPublic': true
    })
      .select('-user')
      .sort('order')

    res.json({
      success: true,
      data: {
        user: {
          name: user.name,
          username: user.username,
          avatar: user.avatar,
          bio: user.bio,
          initials: user.getInitials()
        },
        chains
      }
    })
  } catch (error) {
    console.error('Erreur getPublicChains:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    })
  }
}
