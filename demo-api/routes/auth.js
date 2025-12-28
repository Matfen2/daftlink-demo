import express from 'express'
import { body } from 'express-validator'
import {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  getStats
} from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Validation pour l'inscription
const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 50 }).withMessage('Le nom doit contenir entre 2 et 50 caractères'),
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
    .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
]

// Validation pour la connexion
const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
]

// Routes publiques
router.post('/register', registerValidation, register)
router.post('/login', loginValidation, login)

// Routes protégées
router.get('/me', protect, getMe)
router.put('/me', protect, updateProfile)
router.put('/password', protect, updatePassword)
router.get('/stats', protect, getStats)

export default router
