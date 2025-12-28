import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: 6,
    select: false
  },
  username: {
    type: String,
    unique: true,
    sparse: true
  },
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, { timestamps: true })

// Hash password - syntaxe Mongoose 8+
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 10)
})

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Initials
userSchema.methods.getInitials = function() {
  if (!this.name) return 'U'
  const names = this.name.split(' ')
  return names.length >= 2 
    ? (names[0][0] + names[1][0]).toUpperCase()
    : this.name.substring(0, 2).toUpperCase()
}

const User = mongoose.model('User', userSchema)

export default User