import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import chainRoutes from './routes/chains.js'

// Config
dotenv.config()

// Connexion DB
connectDB()

const app = express()

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/chains', chainRoutes)

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'DaftLink API is running 🚀' })
})

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ 
    success: false, 
    message: 'Erreur serveur', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  })
})

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route non trouvée' })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`)
  console.log(`📡 API disponible sur http://localhost:${PORT}/api`)
})