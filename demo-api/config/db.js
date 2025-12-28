import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 8+ n'a plus besoin d'options supplémentaires
    })
    
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`)
    
    // Événements de connexion
    mongoose.connection.on('error', (err) => {
      console.error(`❌ Erreur MongoDB: ${err.message}`)
    })
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB déconnecté')
    })
    
  } catch (error) {
    console.error(`❌ Erreur connexion MongoDB: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB