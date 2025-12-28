import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Middleware de protection des routes
export const protect = async (req, res, next) => {
  let token

  // Vérifier le header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Non autorisé - Token manquant'
    })
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'daftlink_secret_key_2024')

    // Récupérer l'utilisateur
    const user = await User.findById(decoded.id).select('-password')

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Utilisateur non trouvé'
      })
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Compte désactivé'
      })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Erreur auth middleware:', error.message)
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expiré'
      })
    }
    
    return res.status(401).json({
      success: false,
      message: 'Non autorisé - Token invalide'
    })
  }
}

// Middleware optionnel (ne bloque pas si pas de token)
export const optionalAuth = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'daftlink_secret_key_2024')
      req.user = await User.findById(decoded.id).select('-password')
    } catch (error) {
      // Token invalide, on continue sans user
      req.user = null
    }
  }

  next()
}

// Middleware pour vérifier le plan
export const requirePlan = (...plans) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé'
      })
    }

    if (!plans.includes(req.user.plan)) {
      return res.status(403).json({
        success: false,
        message: `Cette fonctionnalité nécessite un plan ${plans.join(' ou ')}`
      })
    }

    next()
  }
}

// Générer un token JWT
export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'daftlink_secret_key_2024',
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  )
}
