import User from '../models/User.js'
import { generateToken } from '../middleware/auth.js'

// @desc    Inscription
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      })
    }

    // Vérifier si le username existe déjà
    if (username) {
      const existingUsername = await User.findOne({ username })
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'Ce nom d\'utilisateur est déjà pris'
        })
      }
    }

    // Créer l'utilisateur
    const user = await User.create({
      name,
      email,
      password,
      username: username || email.split('@')[0]
    })

    // Générer le token
    const token = generateToken(user._id)

    res.status(201).json({
      success: true,
      message: 'Inscription réussie',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          plan: user.plan,
          initials: user.getInitials(),
          stats: user.stats,
          createdAt: user.createdAt
        },
        token
      }
    })
  } catch (error) {
    console.error('Erreur register:', error)
    
    // Erreurs de validation Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message)
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      })
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription'
    })
  }
}

// @desc    Connexion
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Vérifier les champs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      })
    }

    // Trouver l'utilisateur avec le password
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      })
    }

    // Vérifier le password
    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      })
    }

    // Vérifier si le compte est actif
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé'
      })
    }

    // Mettre à jour lastLogin
    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })

    // Générer le token
    const token = generateToken(user._id)

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          plan: user.plan,
          initials: user.getInitials(),
          stats: user.stats,
          lastLogin: user.lastLogin
        },
        token
      }
    })
  } catch (error) {
    console.error('Erreur login:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    })
  }
}

// @desc    Obtenir le profil utilisateur
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          bio: user.bio,
          plan: user.plan,
          initials: user.getInitials(),
          stats: user.stats,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        }
      }
    })
  } catch (error) {
    console.error('Erreur getMe:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    })
  }
}

// @desc    Mettre à jour le profil
// @route   PUT /api/auth/me
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, username, bio, avatar } = req.body

    // Vérifier si le username est déjà pris
    if (username && username !== req.user.username) {
      const existingUsername = await User.findOne({ username })
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'Ce nom d\'utilisateur est déjà pris'
        })
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, username, bio, avatar },
      { new: true, runValidators: true }
    )

    res.json({
      success: true,
      message: 'Profil mis à jour',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          avatar: user.avatar,
          bio: user.bio,
          plan: user.plan,
          initials: user.getInitials()
        }
      }
    })
  } catch (error) {
    console.error('Erreur updateProfile:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour'
    })
  }
}

// @desc    Changer le mot de passe
// @route   PUT /api/auth/password
// @access  Private
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Mot de passe actuel et nouveau requis'
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
      })
    }

    // Récupérer l'utilisateur avec le password
    const user = await User.findById(req.user._id).select('+password')

    // Vérifier le mot de passe actuel
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      })
    }

    // Mettre à jour le password
    user.password = newPassword
    await user.save()

    // Générer un nouveau token
    const token = generateToken(user._id)

    res.json({
      success: true,
      message: 'Mot de passe mis à jour',
      data: { token }
    })
  } catch (error) {
    console.error('Erreur updatePassword:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du mot de passe'
    })
  }
}

// @desc    Obtenir les stats utilisateur
// @route   GET /api/auth/stats
// @access  Private
export const getStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    // Importer Chain ici pour éviter les dépendances circulaires
    const Chain = (await import('../models/Chain.js')).default

    // Compter les chaînes
    const chainsCount = await Chain.countDocuments({ user: req.user._id })
    const activeChainsCount = await Chain.countDocuments({ user: req.user._id, status: 'active' })

    // Agréger les stats des chaînes
    const chainStats = await Chain.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$stats.views' },
          totalClicks: { $sum: '$stats.clicks' },
          totalRevenue: { $sum: '$stats.revenue' }
        }
      }
    ])

    const stats = chainStats[0] || { totalViews: 0, totalClicks: 0, totalRevenue: 0 }

    res.json({
      success: true,
      data: {
        stats: {
          totalViews: stats.totalViews,
          totalClicks: stats.totalClicks,
          totalRevenue: stats.totalRevenue,
          conversionRate: stats.totalViews > 0 
            ? ((stats.totalClicks / stats.totalViews) * 100).toFixed(1) 
            : 0,
          chainsCount,
          activeChainsCount
        }
      }
    })
  } catch (error) {
    console.error('Erreur getStats:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    })
  }
}
