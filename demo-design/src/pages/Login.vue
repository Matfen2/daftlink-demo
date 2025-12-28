<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/api'

const router = useRouter()

// Form state
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)
const isLoading = ref(false)
const error = ref('')

// Validation
const isEmailValid = computed(() => {
  if (!email.value) return true
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
})

const isFormValid = computed(() => {
  return email.value && password.value && isEmailValid.value
})

// Login handler
const handleLogin = async () => {
  if (!isFormValid.value) return
  
  isLoading.value = true
  error.value = ''

  try {
    await authService.login({
      email: email.value,
      password: password.value
    })
    router.push('/dashboard')
  } catch (err) {
    error.value = err.message || 'Email ou mot de passe incorrect'
  } finally {
    isLoading.value = false
  }
}

// Features
const features = [
  { icon: '🔗', title: 'Chaînes de réduction', desc: 'Créez des offres irrésistibles' },
  { icon: '📊', title: 'Analytics avancés', desc: 'Suivez vos performances en temps réel' },
  { icon: '🚀', title: 'Conversion optimisée', desc: 'Augmentez vos ventes facilement' }
]
</script>

<template>
  <div class="min-h-screen bg-black flex">
    <!-- Left Side - Branding -->
    <div class="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <!-- Background effects -->
      <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/20 via-black to-black"></div>
      <div class="absolute top-20 left-20 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-20 right-20 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      
      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center px-16 py-12">
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-16">
          <img src="../../public/images/logo_white_hd.png" alt="DaftLink Logo" class="w-86 h-12" />
        </div>

        <!-- Tagline -->
        <h1 class="text-5xl font-bold text-white mb-6 leading-tight">
          Transformez vos visiteurs en 
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">clients fidèles</span>
        </h1>
        
        <p class="text-xl text-gray-400 mb-12 max-w-md">
          La plateforme tout-en-un pour créer des chaînes de réduction qui convertissent.
        </p>

        <!-- Features -->
        <div class="grid grid-cols-3 gap-4">
          <div 
            v-for="(feature, index) in features" 
            :key="index"
            class="flex flex-row items-center text-center gap-3 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-yellow-500/30 hover:bg-white/10 transition-all duration-300"
          >
            <div class="w-14 h-14 rounded-xl bg-yellow-500/20 flex items-center justify-center text-2xl">
              {{ feature.icon }}
            </div>
            <div>
              <h3 class="text-white font-semibold text-sm">{{ feature.title }}</h3>
              <p class="text-gray-500 text-xs mt-1">{{ feature.desc }}</p>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="flex gap-12 mt-16">
          <div>
            <div class="text-3xl font-bold text-white">10K+</div>
            <div class="text-gray-500 text-sm">Utilisateurs</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-white">€2M+</div>
            <div class="text-gray-500 text-sm">Revenus générés</div>
          </div>
          <div>
            <div class="text-3xl font-bold text-white">98%</div>
            <div class="text-gray-500 text-sm">Satisfaction</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side - Login Form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8">
      <div class="w-full max-w-md animate-fade-in-up">
        <!-- Mobile Logo -->
        <div class="flex items-center justify-center gap-3 mb-10 lg:hidden">
          <div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-xl flex items-center justify-center font-extrabold text-xl text-black">
            D
          </div>
          <span class="text-3xl font-extrabold text-white">Daft<span class="text-yellow-500">Link</span></span>
        </div>

        <!-- Login Card -->
        <div class="bg-[#0a0a0a] rounded-3xl p-8 border border-white/10">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-white mb-2">Bon retour ! 👋</h2>
            <p class="text-gray-500">Connectez-vous pour continuer</p>
          </div>

          <!-- Error -->
          <div v-if="error" class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
            <svg class="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-red-500 text-sm">{{ error }}</p>
            <button @click="error = ''" class="ml-auto text-red-500 hover:text-red-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input 
                  v-model="email"
                  type="email" 
                  :class="[
                    'w-full bg-[#111111] border rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-600 focus:outline-none transition-all',
                    !isEmailValid ? 'border-red-500/50' : 'border-white/10 focus:border-yellow-500'
                  ]"
                  placeholder="votre@email.com"
                />
                <div v-if="email && isEmailValid" class="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p v-if="!isEmailValid && email" class="mt-2 text-sm text-red-500">Email invalide</p>
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-2">Mot de passe</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input 
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full bg-[#111111] border border-white/10 rounded-xl pl-12 pr-12 py-3.5 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500 transition-all"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                >
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Remember & Forgot -->
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="rememberMe" class="w-4 h-4 rounded border-gray-600 bg-[#111111] text-yellow-500 focus:ring-yellow-500 focus:ring-offset-0" />
                <span class="text-sm text-gray-400">Se souvenir de moi</span>
              </label>
              <a href="#" class="text-sm text-yellow-500 hover:text-yellow-400 hover:underline">
                Mot de passe oublié ?
              </a>
            </div>

            <!-- Submit -->
            <button 
              type="submit"
              :disabled="isLoading || !isFormValid"
              class="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-[0_8px_32px_rgba(234,179,8,0.4)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <svg v-if="isLoading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isLoading ? 'Connexion...' : 'Se connecter' }}</span>
              <svg v-if="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </form>

          <!-- Divider -->
          <div class="flex items-center gap-4 my-6">
            <div class="flex-1 h-px bg-white/10"></div>
            <span class="text-gray-600 text-sm">ou</span>
            <div class="flex-1 h-px bg-white/10"></div>
          </div>

          <!-- Social Login -->
          <div class="grid grid-cols-2 gap-3">
            <button class="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#111111] border border-white/10 text-white hover:bg-white/5 transition-all">
              <svg class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button class="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#111111] border border-white/10 text-white hover:bg-white/5 transition-all">
              <svg class="w-5 h-5" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              Microsoft
            </button>
          </div>

          <!-- Sign Up -->
          <p class="text-center text-gray-500 mt-6">
            Pas encore de compte ? 
            <router-link to="/register" class="text-yellow-500 hover:text-yellow-400 font-semibold hover:underline">
              Créer un compte
            </router-link>
          </p>
        </div>

        <p class="text-center text-gray-600 text-sm mt-6">
          © 2025 DaftLink. Tous droits réservés.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}
</style>