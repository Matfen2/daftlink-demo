import express from 'express'
import { body } from 'express-validator'
import {
  getChains,
  getChain,
  createChain,
  updateChain,
  deleteChain,
  reorderChains,
  duplicateChain,
  getChainStats,
  trackView,
  trackClick,
  getPublicChains
} from '../controllers/chainController.js'
import { protect, optionalAuth } from '../middleware/auth.js'

const router = express.Router()

// Validation pour la création de chaîne
const createChainValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Le nom du produit est requis')
    .isLength({ max: 100 }).withMessage('Le nom ne peut pas dépasser 100 caractères'),
  body('priceInitial')
    .notEmpty().withMessage('Le prix initial est requis')
    .isFloat({ min: 0 }).withMessage('Le prix doit être positif'),
  body('priceFinal')
    .notEmpty().withMessage('Le prix final est requis')
    .isFloat({ min: 0 }).withMessage('Le prix doit être positif'),
  body('url')
    .notEmpty().withMessage('L\'URL est requise')
    .isURL().withMessage('URL invalide')
]

// Routes publiques
router.get('/public/:username', getPublicChains)
router.post('/:id/view', trackView)
router.post('/:id/click', trackClick)

// Routes protégées
router.use(protect) // Toutes les routes suivantes nécessitent auth

router.route('/')
  .get(getChains)
  .post(createChainValidation, createChain)

router.put('/reorder', reorderChains)

router.route('/:id')
  .get(getChain)
  .put(updateChain)
  .delete(deleteChain)

router.post('/:id/duplicate', duplicateChain)
router.get('/:id/stats', getChainStats)

export default router
