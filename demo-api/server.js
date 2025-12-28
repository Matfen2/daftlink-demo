import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import chainRoutes from './routes/chains.js'
import userRoutes from './routes/users.js'

// Config
dotenv.config()

// Connexion DB
connectDB()

const app = express()

// CORS Configuration pour production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
  'https://daftlink-demo.vercel.app',
  /\.vercel\.app$/
].filter(Boolean)

app.use(cors({
  origin: function (origin, callback) {
    // Autorise les requêtes sans origin (Postman, mobile apps, etc.)
    if (!origin) return callback(null, true)
    
    // Vérifie si l'origin est dans la liste ou match le regex
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) return allowed.test(origin)
      return allowed === origin
    })
    
    if (isAllowed) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Trust proxy (pour Render)
app.set('trust proxy', 1)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/chains', chainRoutes)

// Route de santé (importante pour Render)
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'DaftLink API 🚀',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      users: '/api/users',
      chains: '/api/chains'
    }
  })
})

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'DaftLink API is running 🚀',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Gestion des erreurs globale
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  console.error('Stack:', err.stack)
  
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Erreur serveur',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
})

// 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.method} ${req.url} non trouvée` 
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`)
  console.log(`📡 API disponible sur http://localhost:${PORT}/api`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})