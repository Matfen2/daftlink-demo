import mongoose from 'mongoose'

const chainSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  emoji: {
    type: String,
    default: '🔗'
  },
  description: {
    type: String,
    maxlength: [500, 'La description ne peut pas dépasser 500 caractères']
  },
  category: {
    type: String,
    enum: ['Électronique', 'Mode', 'Maison', 'Sport', 'Beauté', 'Gaming', 'Autre'],
    default: 'Autre'
  },
  priceInitial: {
    type: Number,
    required: [true, 'Le prix initial est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  priceFinal: {
    type: Number,
    required: [true, 'Le prix final est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  discount: {
    type: Number,
    default: 0
  },
  url: {
    type: String,
    required: [true, 'L\'URL du produit est requise'],
    match: [/^https?:\/\/.+/, 'URL invalide']
  },
  expiresAt: {
    type: Date,
    required: true
  },
  expiresInDays: {
    type: Number,
    default: 7
  },
  maxParticipants: {
    type: Number,
    default: 100,
    min: [1, 'Minimum 1 participant']
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'expired', 'completed'],
    default: 'active'
  },
  stats: {
    views: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    conversions: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 }
  },
  settings: {
    isPublic: { type: Boolean, default: true },
    showParticipants: { type: Boolean, default: true },
    showCountdown: { type: Boolean, default: true },
    featured: { type: Boolean, default: false }
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
})

// Calculer la réduction avant sauvegarde
chainSchema.pre('save', function(next) {
  if (this.priceInitial && this.priceFinal) {
    this.discount = this.priceInitial - this.priceFinal
  }
  next()
})

// Index pour les recherches
chainSchema.index({ user: 1, status: 1 })
chainSchema.index({ user: 1, createdAt: -1 })
chainSchema.index({ expiresAt: 1 })

// Virtuel: jours restants
chainSchema.virtual('daysLeft').get(function() {
  if (!this.expiresAt) return 0
  const now = new Date()
  const diff = this.expiresAt - now
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
})

// Virtuel: est expiré
chainSchema.virtual('isExpired').get(function() {
  return this.expiresAt && new Date() > this.expiresAt
})

// Virtuel: taux de conversion
chainSchema.virtual('conversionRate').get(function() {
  if (this.stats.views === 0) return 0
  return ((this.stats.clicks / this.stats.views) * 100).toFixed(1)
})

// Méthode pour incrémenter les vues
chainSchema.methods.incrementViews = async function() {
  this.stats.views += 1
  return this.save()
}

// Méthode pour incrémenter les clics
chainSchema.methods.incrementClicks = async function() {
  this.stats.clicks += 1
  return this.save()
}

// Méthode pour ajouter un participant
chainSchema.methods.addParticipant = async function() {
  if (this.currentParticipants >= this.maxParticipants) {
    throw new Error('Nombre maximum de participants atteint')
  }
  this.currentParticipants += 1
  return this.save()
}

// Inclure les virtuels dans JSON
chainSchema.set('toJSON', { virtuals: true })
chainSchema.set('toObject', { virtuals: true })

// Méthode statique: mettre à jour les chaînes expirées
chainSchema.statics.updateExpiredChains = async function() {
  const now = new Date()
  return this.updateMany(
    { expiresAt: { $lt: now }, status: 'active' },
    { status: 'expired' }
  )
}

const Chain = mongoose.model('Chain', chainSchema)

export default Chain
