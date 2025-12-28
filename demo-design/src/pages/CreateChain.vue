<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Étape actuelle
const currentStep = ref(1)
const totalSteps = 3

// Données du formulaire
const formData = ref({
  name: '',
  emoji: '🎧',
  description: '',
  priceInitial: '',
  priceFinal: '',
  expiresIn: 7,
  maxParticipants: 100,
  category: '',
  url: ''
})

const emojis = ['🎧', '📱', '💻', '🎮', '⌚', '📷', '🖥️', '🎬', '🎵', '👟']

const categories = [
  'Électronique',
  'Mode',
  'Maison',
  'Sport',
  'Beauté',
  'Gaming',
  'Autre'
]

const discount = computed(() => {
  const initial = parseFloat(formData.value.priceInitial) || 0
  const final = parseFloat(formData.value.priceFinal) || 0
  return initial - final
})

const progress = computed(() => {
  return (currentStep.value / totalSteps) * 100
})

const nextStep = () => {
  if (currentStep.value < totalSteps) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const createChain = () => {
  console.log('Création de la chaîne:', formData.value)
  router.push('/')
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-black p-8">
    <!-- Header -->
    <div class="max-w-3xl mx-auto mb-8">
      <button 
        @click="goBack"
        class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Retour au dashboard
      </button>

      <div class="flex items-center gap-4 animate-slide-down">
        <div class="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-xl flex items-center justify-center shadow-[0_4px_20px_rgba(234,179,8,0.3)]">
          <svg class="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h1 class="text-2xl font-bold text-white">Nouvelle Chaîne de Réduction</h1>
          <p class="text-gray-500">Créez une offre irrésistible pour vos clients</p>
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="max-w-3xl mx-auto mb-8">
      <div class="flex justify-between text-sm text-gray-500 mb-2">
        <span>Étape {{ currentStep }} sur {{ totalSteps }}</span>
        <span>{{ Math.round(progress) }}%</span>
      </div>
      <div class="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500 rounded-full"
          :style="{ width: progress + '%' }"
        ></div>
      </div>
    </div>

    <!-- Form Card -->
    <div class="max-w-3xl mx-auto bg-[#111111] rounded-[20px] p-8 border border-white/5 animate-fade-in-up">
      <!-- Step 1: Informations de base -->
      <div v-if="currentStep === 1" class="space-y-6">
        <h2 class="text-xl font-bold mb-6">📝 Informations de base</h2>

        <div class="grid grid-cols-[auto_1fr] gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Emoji</label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="emoji in emojis"
                :key="emoji"
                @click="formData.emoji = emoji"
                :class="[
                  'w-12 h-12 rounded-xl text-xl flex items-center justify-center transition-all duration-200',
                  formData.emoji === emoji 
                    ? 'bg-yellow-500 shadow-[0_4px_20px_rgba(234,179,8,0.3)]' 
                    : 'bg-[#1a1a1a] border border-white/10 hover:border-yellow-500/50'
                ]"
              >
                {{ emoji }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Nom du produit</label>
            <input 
              v-model="formData.name"
              type="text" 
              class="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors"
              placeholder="ex: Casque Sony WH-1000XM5"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Description</label>
          <textarea 
            v-model="formData.description"
            rows="3"
            class="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
            placeholder="Décrivez votre offre..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Catégorie</label>
          <select 
            v-model="formData.category"
            class="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
          >
            <option value="" disabled>Sélectionnez une catégorie</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
      </div>

      <!-- Step 2: Prix et réduction -->
      <div v-if="currentStep === 2" class="space-y-6">
        <h2 class="text-xl font-bold mb-6">💰 Prix et réduction</h2>

        <div class="grid grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Prix initial (€)</label>
            <input 
              v-model="formData.priceInitial"
              type="number" 
              class="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors"
              placeholder="349"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2">Prix final (€)</label>
            <input 
              v-model="formData.priceFinal"
              type="number" 
              class="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors"
              placeholder="279"
            />
          </div>
        </div>

        <!-- Preview de la réduction -->
        <div v-if="discount > 0" class="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 text-center">
          <p class="text-gray-400 text-sm mb-2">Réduction affichée</p>
          <span class="text-4xl font-extrabold text-yellow-500">-{{ discount }}€</span>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">URL du produit</label>
          <input 
            v-model="formData.url"
            type="url" 
            class="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors"
            placeholder="https://..."
          />
        </div>
      </div>

      <!-- Step 3: Paramètres -->
      <div v-if="currentStep === 3" class="space-y-6">
        <h2 class="text-xl font-bold mb-6">⚙️ Paramètres</h2>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Durée de l'offre (jours)</label>
          <input 
            v-model="formData.expiresIn"
            type="range"
            min="1"
            max="30"
            class="w-full accent-yellow-500"
          />
          <div class="flex justify-between text-sm text-gray-500 mt-2">
            <span>1 jour</span>
            <span class="text-yellow-500 font-bold">{{ formData.expiresIn }} jours</span>
            <span>30 jours</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2">Nombre max de participants</label>
          <input 
            v-model="formData.maxParticipants"
            type="number" 
            class="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors"
            placeholder="100"
          />
        </div>

        <!-- Preview Card -->
        <div class="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10">
          <h3 class="text-sm font-medium text-gray-400 mb-4">Aperçu de votre chaîne</h3>
          <div class="flex items-center gap-4">
            <div class="text-3xl">{{ formData.emoji }}</div>
            <div class="flex-1">
              <h4 class="font-bold">{{ formData.name || 'Nom du produit' }}</h4>
              <div class="flex gap-4 text-sm text-gray-500 mt-1">
                <span>⏱️ {{ formData.expiresIn }} jours</span>
                <span>👥 {{ formData.maxParticipants }} max</span>
              </div>
            </div>
            <div class="bg-yellow-500 text-black font-bold px-4 py-2 rounded-full" v-if="discount > 0">
              -{{ discount }}€
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between mt-8 pt-6 border-t border-white/10">
        <button 
          v-if="currentStep > 1"
          @click="prevStep"
          class="px-6 py-3 rounded-xl font-semibold text-sm bg-[#1a1a1a] text-white border border-white/10 hover:bg-[#222222] transition-all duration-200"
        >
          ← Précédent
        </button>
        <div v-else></div>

        <button 
          v-if="currentStep < totalSteps"
          @click="nextStep"
          class="px-6 py-3 rounded-xl font-semibold text-sm bg-yellow-500 text-black shadow-[0_4px_20px_rgba(234,179,8,0.3)] hover:bg-yellow-400 hover:-translate-y-0.5 transition-all duration-200"
        >
          Suivant →
        </button>
        <button 
          v-else
          @click="createChain"
          class="px-8 py-3 rounded-xl font-semibold text-sm bg-yellow-500 text-black shadow-[0_4px_20px_rgba(234,179,8,0.3)] hover:bg-yellow-400 hover:-translate-y-0.5 transition-all duration-200"
        >
          🚀 Créer la chaîne
        </button>
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

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

.animate-slide-down {
  animation: slideDown 0.5s ease-out forwards;
}
</style>