import express from 'express'
import { body, validationResult } from 'express-validator'
import User from '../models/User.js'
import { generateToken, protect } from '../middleware/auth.js'

const router = express.Router()

// @desc    Inscription utilisateur
// @route   POST /api/users/register
// @access  Public
router.post('/register', [
  body('username').optional().trim().isLength({ min: 2 }).withMessage('Username doit avoir au moins 2 caractères'),
  body('email').trim().isEmail().withMessage('Email invalide').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit avoir au moins 6 caractères')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array()
      })
    }

    const { username, email, password, name } = req.body

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
      name: name || username || email.split('@')[0],
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
          createdAt: user.createdAt
        },
        token
      }
    })
  } catch (error) {
    console.error('Erreur register:', error)
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription',
      error: error.message
    })
  }
})

// @desc    Connexion utilisateur
// @route   POST /api/users/login
// @access  Public
router.post('/login', [
  body('email').trim().isEmail().withMessage('Email invalide').normalizeEmail(),
  body('password').notEmpty().withMessage('Mot de passe requis')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      })
    }

    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      })
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      })
    }

    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })

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
          plan: user.plan
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
})

// @desc    Profil utilisateur
// @route   GET /api/users/me
// @access  Private
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    data: { user: req.user }
  })
})

export default router