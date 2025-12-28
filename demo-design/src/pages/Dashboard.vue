<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Fonction de déconnexion
const logout = () => {
  localStorage.removeItem('daftlink_token')
  localStorage.removeItem('daftlink_user')
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

// Données réactives
const userName = ref('Mathieu')
const daftlink = ref('mathieu.fenouil')
const searchQuery = ref('')
const showMobilePreview = ref(false)
const isLoaded = ref(false)

// Période de performance sélectionnée
const performancePeriod = ref('7d')

// Données du graphique par période
const chartDataByPeriod = ref({
  '7d': [40, 60, 45, 80, 65, 90, 75],
  '14d': [35, 45, 55, 40, 70, 60, 85, 75, 50, 65, 80, 90, 70, 85],
  '1m': [30, 45, 40, 55, 50, 65, 60, 75, 70, 85, 80, 95, 90, 70, 75, 80, 65, 70, 85, 90, 75, 80, 95, 85, 70, 75, 90, 85, 80, 95]
})

// Computed pour les données actuelles du graphique
const currentChartData = computed(() => chartDataByPeriod.value[performancePeriod.value])

// Labels des périodes
const periodLabels = {
  '7d': '7 jours',
  '14d': '14 jours',
  '1m': '1 mois'
}

// Copier l'URL
const copyUrl = async () => {
  const url = `https://daftlink.io/${daftlink.value}`
  await navigator.clipboard.writeText(url)
}

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})

const stats = ref([
  { id: 1, icon: '👁️', value: '12,847', label: 'Vues totales', change: '+24.5%', positive: true },
  { id: 2, icon: '🖱️', value: '3,241', label: 'Clics', change: '+18.2%', positive: true },
  { id: 3, icon: '📊', value: '25.2%', label: 'Taux de conversion', change: '-2.4%', positive: false },
  { id: 4, icon: '💰', value: '€2,847', label: 'Revenus estimés', change: '+32.1%', positive: true }
])

const chains = ref([
  {
    id: 1,
    name: 'Casque Sony WH-1000XM5',
    emoji: '🎧',
    expiresIn: '5 jours',
    participants: 127,
    priceInitial: 349,
    priceFinal: 279,
    discount: 70
  },
  {
    id: 2,
    name: 'iPhone 15 Pro Max',
    emoji: '📱',
    expiresIn: '12 jours',
    participants: 89,
    priceInitial: 1479,
    priceFinal: 1279,
    discount: 200
  },
  {
    id: 3,
    name: 'MacBook Air M3',
    emoji: '💻',
    expiresIn: '20 jours',
    participants: 54,
    priceInitial: 1299,
    priceFinal: 1099,
    discount: 200
  }
])

const activities = ref([
  { id: 1, icon: '👁️', text: 'Nouvelle vue sur', target: 'Casque Sony', time: 'Il y a 2 minutes' },
  { id: 2, icon: '🖱️', text: 'Clic sur', target: 'iPhone 15 Pro', time: 'Il y a 15 minutes' },
  { id: 3, icon: '🔄', text: 'Partage de', target: 'MacBook Air', time: 'Il y a 1 heure' }
])

const navItems = ref([
  { id: 1, icon: 'dashboard', label: 'Dashboard', active: true, badge: null },
  { id: 2, icon: 'chain', label: 'Mes Chaînes', active: false, badge: 5 },
  { id: 3, icon: 'analytics', label: 'Analytics', active: false, badge: null },
  { id: 4, icon: 'widgets', label: 'Widgets', active: false, badge: null }
])

const configItems = ref([
  { id: 1, icon: 'settings', label: 'Paramètres' },
  { id: 2, icon: 'help', label: 'Aide' }
])

// Filtrer les chaînes par recherche
const filteredChains = computed(() => {
  if (!searchQuery.value) return chains.value
  const query = searchQuery.value.toLowerCase()
  return chains.value.filter(chain => 
    chain.name.toLowerCase().includes(query)
  )
})
</script>

<template>
  <div class="min-h-screen bg-black text-white font-inter">
    <!-- Sidebar -->
    <aside class="fixed left-0 top-0 w-[280px] h-screen bg-[#111111] border-r border-yellow-500/10 p-6 flex flex-col z-50">
      <!-- Logo -->
      <div class="flex items-center gap-3 mb-8">
        <img src="../../public/images/logo_white_hd.png" alt="DaftLink Logo" class="h-12 mx-auto" />
      </div>

      <!-- Navigation principale -->
      <nav class="mb-8">
        <p class="text-[11px] font-semibold uppercase tracking-[1.5px] text-gray-500 mb-4 pl-4">Menu Principal</p>
        
        <div
          v-for="item in navItems"
          :key="item.id"
          :class="[
            'flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 mb-1 animate-fade-in',
            item.active 
              ? 'bg-yellow-500 text-black font-semibold shadow-[0_4px_20px_rgba(234,179,8,0.3)]' 
              : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white border border-transparent hover:border-yellow-500/10'
          ]"
          :style="{ animationDelay: item.id * 50 + 'ms' }"
        >
          <!-- Icons -->
          <svg v-if="item.icon === 'dashboard'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <svg v-else-if="item.icon === 'chain'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <svg v-else-if="item.icon === 'analytics'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <svg v-else-if="item.icon === 'widgets'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
          </svg>
          
          <span>{{ item.label }}</span>
          
          <span 
            v-if="item.badge" 
            class="ml-auto bg-yellow-500 text-black text-[11px] font-bold px-2.5 py-0.5 rounded-full"
          >
            {{ item.badge }}
          </span>
        </div>
      </nav>

      <!-- Configuration -->
      <nav>
        <p class="text-[11px] font-semibold uppercase tracking-[1.5px] text-gray-500 mb-4 pl-4">Configuration</p>
        
        <div
          v-for="item in configItems"
          :key="item.id"
          class="flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 mb-1 text-gray-400 hover:bg-[#1a1a1a] hover:text-white border border-transparent hover:border-yellow-500/10"
        >
          <svg v-if="item.icon === 'settings'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <svg v-else-if="item.icon === 'help'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ item.label }}</span>
        </div>
      </nav>

      <!-- User Card -->
      <div class="mt-auto bg-[#1a1a1a] border border-yellow-500/20 rounded-2xl p-4">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-400 flex items-center justify-center font-extrabold text-black">
            MF
          </div>
          <div>
            <h4 class="text-sm font-semibold">Mathieu Fenouil</h4>
            <span class="text-xs text-yellow-500 font-medium flex items-center gap-1">
              <span>⭐</span> Plan Pro
            </span>
          </div>
        </div>
        <button 
          @click="logout"
          class="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all duration-200"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Déconnexion
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="ml-[280px] p-8 transition-all duration-300" :class="showMobilePreview ? 'mr-[400px]' : ''">
      <!-- Header -->
      <header class="flex justify-between items-center mb-8 animate-slide-down">
        <h1 class="text-[28px] font-bold">
          👋 Bonjour, <span class="text-yellow-500">{{ userName }}</span> !
        </h1>
        <div class="flex gap-3">
          <button class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-[#111111] text-white border border-white/10 hover:bg-[#1a1a1a] hover:border-yellow-500 transition-all duration-200">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Partager
          </button>
          <!-- Bouton Prévisualisation Mobile -->
          <button 
            @click="showMobilePreview = !showMobilePreview"
            :class="[
              'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200',
              showMobilePreview 
                ? 'bg-yellow-500 text-black shadow-[0_4px_20px_rgba(234,179,8,0.3)]' 
                : 'bg-[#111111] text-white border border-white/10 hover:bg-[#1a1a1a] hover:border-yellow-500'
            ]"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            <span>{{ showMobilePreview ? 'Fermer' : 'Aperçu' }}</span>
          </button>
        </div>
      </header>

      <!-- DaftLink Banner + Stats Grid -->
      <div class="grid grid-cols-[3fr_2fr] gap-6 mb-8">
        
        <!-- DaftLink URL Banner -->
        <div class="bg-[#111111] rounded-[20px] p-6 border border-white/5 flex flex-col justify-center animate-fade-in-up">
          <div class="flex flex-row items-center gap-3 mb-4">
            <div class="space-y-4 flex flex-row items-end justify-between w-full">
       
              <div>
                <p class="text-sm text-gray-400">Votre DaftLink est en ligne</p>
                <p class="text-white font-semibold">daftlink.io/<span class="text-yellow-500">{{ daftlink }}</span></p>
              </div>
              <div class="flex gap-2">
                <button 
                  @click="copyUrl"
                  class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[#1a1a1a] border border-white/10 text-white hover:border-yellow-500 hover:bg-yellow-500/10 transition-all duration-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copier
                </button>
                <a 
                  :href="'https://daftlink.io/' + daftlink" 
                  target="_blank"
                  class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-yellow-500 text-black hover:bg-yellow-400 transition-all duration-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Visiter
                </a>
              </div>
            </div>
          </div>
  
        </div>

        <!-- Stats Grid 2x2 -->
        <div class="grid grid-cols-2 gap-4">
          <div 
            v-for="(stat, index) in stats" 
            :key="stat.id"
            class="bg-[#111111] rounded-[20px] p-5 border border-white/5 flex flex-row gap-4 items-center animate-fade-in-up hover:-translate-y-1 hover:border-yellow-500/30 transition-all duration-300"
            :style="{ animationDelay: (index + 1) * 100 + 'ms' }"
          >
            <div class="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center text-2xl bg-yellow-500/15 border border-yellow-500/30 flex-shrink-0">
              {{ stat.icon }}
            </div>
            <div class="flex flex-col">
              <div class="text-3xl font-extrabold">{{ stat.value }}</div>
              <div class="text-xs text-gray-500 font-medium">{{ stat.label }}</div>
              <div 
                :class="[
                  'inline-flex items-center gap-1 text-[12px] font-semibold mt-1 px-2 py-1 rounded-md w-fit',
                  stat.positive ? 'bg-green-500/15 text-green-500' : 'bg-red-500/15 text-red-500'
                ]"
              >
                <span v-if="stat.positive">↗</span>
                <span v-else>↘</span>
                {{ stat.change }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-[2fr_1fr] gap-6">
        <!-- Left Column - Chains -->
        <section class="bg-[#111111] rounded-[20px] p-6 border border-white/5 animate-fade-in" style="animation-delay: 400ms">
          <!-- Header avec recherche -->
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold flex items-center gap-2">
              <span>🔗</span> Mes Chaînes de Réduction
            </h3>
            
            <!-- Search Input -->
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher une chaîne..."
                class="w-64 bg-[#1a1a1a] border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors"
              />
              <button 
                v-if="searchQuery"
                @click="searchQuery = ''"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-white transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Chains List -->
          <div class="flex flex-col gap-4">
            <!-- Message si aucun résultat -->
            <div v-if="filteredChains.length === 0" class="text-center py-12">
              <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p class="text-gray-500">Aucune chaîne trouvée pour "{{ searchQuery }}"</p>
            </div>

            <div
              v-for="(chain, index) in filteredChains"
              :key="chain.id"
              class="bg-[#1a1a1a] rounded-2xl p-5 grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-5 border border-white/5 hover:bg-yellow-500/5 hover:border-yellow-500/30 hover:translate-x-1 transition-all duration-300 cursor-pointer animate-fade-in-left"
              :style="{ animationDelay: (index * 100 + 500) + 'ms' }"
            >
              <!-- Drag Handle -->
              <div class="w-6 flex flex-col gap-0.5 opacity-30 cursor-grab hover:opacity-60">
                <span class="w-full h-0.5 bg-gray-500 rounded-sm"></span>
                <span class="w-full h-0.5 bg-gray-500 rounded-sm"></span>
                <span class="w-full h-0.5 bg-gray-500 rounded-sm"></span>
              </div>

              <!-- Info -->
              <div>
                <h3 class="text-base font-semibold mb-2">{{ chain.emoji }} {{ chain.name }}</h3>
                <div class="flex gap-5 text-[13px] text-gray-500">
                  <span>⏱️ Expire dans {{ chain.expiresIn }}</span>
                  <span>👥 {{ chain.participants }} participants</span>
                </div>
              </div>

              <!-- Stats -->
              <div class="flex gap-8 text-center">
                <div>
                  <span class="text-lg font-bold">{{ chain.priceInitial }}€</span>
                  <div class="text-[11px] text-gray-500 uppercase tracking-[0.5px] mt-0.5">Prix initial</div>
                </div>
                <div>
                  <span class="text-lg font-bold text-yellow-500">{{ chain.priceFinal }}€</span>
                  <div class="text-[11px] text-gray-500 uppercase tracking-[0.5px] mt-0.5">Prix final</div>
                </div>
              </div>

              <!-- Badge -->
              <div class="inline-flex items-center px-4 py-2 bg-yellow-500 text-black rounded-full text-sm font-bold shadow-[0_4px_20px_rgba(234,179,8,0.3)]">
                -{{ chain.discount }}€
              </div>

              <!-- Actions -->
              <div class="flex gap-2">
                <button class="w-10 h-10 rounded-[10px] bg-[#111111] border border-white/10 text-gray-500 hover:bg-yellow-500 hover:text-black hover:border-yellow-500 flex items-center justify-center transition-all duration-200">
                  ✏️
                </button>
                <button class="w-10 h-10 rounded-[10px] bg-[#111111] border border-white/10 text-gray-500 hover:bg-yellow-500 hover:text-black hover:border-yellow-500 flex items-center justify-center transition-all duration-200">
                  📋
                </button>
              </div>
            </div>
          </div>

          <!-- Bouton Ajouter Chaîne -->
          <div class="bg-[#111111] border border-dashed border-yellow-500/30 mt-6 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-yellow-500 hover:bg-yellow-500/5 transition-all duration-300 cursor-pointer group"
              @click="$router.push('/create')">
            <div class="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
              <svg class="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p class="text-gray-400 text-sm group-hover:text-white transition-colors">Créer une nouvelle chaîne</p>
          </div>
        </section>

        <!-- Right Column -->
        <div class="flex flex-col gap-6">
          
          <!-- Performance Chart -->
          <section class="bg-[#111111] rounded-[20px] p-6 border border-white/5 animate-fade-in" style="animation-delay: 600ms">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-bold flex items-center gap-2">
                <span>📈</span> Performance
              </h3>
              
              <!-- Period Selector -->
              <div class="flex gap-1 bg-[#1a1a1a] rounded-lg p-1">
                <button 
                  v-for="period in ['7d', '14d', '1m']"
                  :key="period"
                  @click="performancePeriod = period"
                  :class="[
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200',
                    performancePeriod === period 
                      ? 'bg-yellow-500 text-black' 
                      : 'text-gray-400 hover:text-white'
                  ]"
                >
                  {{ periodLabels[period] }}
                </button>
              </div>
            </div>
            
            <div class="h-[180px] bg-gradient-to-b from-yellow-500/10 to-transparent rounded-xl flex items-end p-4 gap-1">
              <div
                v-for="(height, index) in currentChartData"
                :key="performancePeriod + '-' + index"
                class="flex-1 bg-gradient-to-t from-yellow-500 to-yellow-400 rounded-t-md shadow-[0_0_10px_rgba(234,179,8,0.3)] animate-grow-up"
                :style="{ 
                  height: height + '%',
                  animationDelay: (index * 30) + 'ms'
                }"
              ></div>
            </div>
          </section>

          <!-- Recent Activity -->
          <section class="bg-[#111111] rounded-[20px] p-6 border border-white/5 animate-fade-in" style="animation-delay: 700ms">
            <h3 class="text-lg font-bold mb-4 flex items-center gap-2">
              <span>🔔</span> Activité Récente
            </h3>
            <div class="flex flex-col gap-3">
              <div
                v-for="activity in activities"
                :key="activity.id"
                class="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-xl hover:bg-yellow-500/5 transition-all duration-200"
              >
                <div class="w-11 h-11 rounded-xl flex items-center justify-center text-lg bg-yellow-500/10 border border-yellow-500/20">
                  {{ activity.icon }}
                </div>
                <div>
                  <p class="text-sm mb-0.5">
                    {{ activity.text }} <strong class="text-yellow-500">{{ activity.target }}</strong>
                  </p>
                  <span class="text-xs text-gray-500">{{ activity.time }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>

    <!-- Mobile Preview Panel -->
    <Transition name="slide">
      <div 
        v-if="showMobilePreview"
        class="fixed right-8 top-8 bottom-8 w-[375px] z-40"
      >
        <!-- Phone Frame -->
        <div class="relative h-full bg-[#0a0a0a] rounded-[50px] border-[8px] border-[#1a1a1a] shadow-2xl shadow-black/50 overflow-hidden">
          <!-- Phone Notch -->
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-[#1a1a1a] rounded-b-3xl z-10 flex items-center justify-center">
            <div class="w-16 h-4 bg-[#0a0a0a] rounded-full"></div>
          </div>
          
          <!-- Phone Content -->
          <div class="h-full overflow-y-auto pt-12 pb-10 px-5 scrollbar-hide">
            <!-- Header -->
            <div class="text-center mb-6">
              <div class="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-500 to-yellow-400 flex items-center justify-center text-3xl font-extrabold text-black shadow-[0_8px_30px_rgba(234,179,8,0.4)] mb-4">
                MF
              </div>
              <h2 class="text-xl font-bold text-white">Mathieu Fenouil</h2>
              <p class="text-sm text-gray-500 mb-2">@{{ daftlink }}</p>
              <p class="text-sm text-gray-400 px-4">
                Les meilleures offres tech ici !
              </p>
            </div>

            <!-- Links -->
            <div class="flex flex-col gap-3">
              <a
                v-for="(chain, index) in chains"
                :key="chain.id"
                href="#"
                class="block rounded-2xl px-5 py-4 text-center font-semibold transition-all duration-200 border"
                :class="index === 0 
                  ? 'bg-yellow-500 text-black border-yellow-500 shadow-[0_4px_20px_rgba(234,179,8,0.3)]' 
                  : 'bg-[#1a1a1a] border-white/10 text-white hover:bg-yellow-500/10 hover:border-yellow-500/30'"
              >
                <div class="flex items-center justify-center gap-2 text-base">
                  <span>{{ chain.emoji }}</span>
                  <span>{{ chain.name }}</span>
                </div>
                <div class="text-sm mt-1 font-bold" :class="index === 0 ? 'text-black/70' : 'text-yellow-500'">
                  -{{ chain.discount }}€
                </div>
              </a>
            </div>

            <!-- Social Links -->
            <div class="flex justify-center gap-4 mt-8">
              <a href="#" class="w-12 h-12 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-yellow-500/50 transition-all">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" class="w-12 h-12 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-yellow-500/50 transition-all">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" class="w-12 h-12 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-yellow-500/50 transition-all">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                </svg>
              </a>
            </div>

            <!-- Footer -->
            <div class="flex justify-center mt-10">
              <img src="../../public/images/logo_white_hd.png" alt="DaftLink Logo" class="h-12 mx-auto" />
            </div>
          </div>

          <!-- Home Indicator -->
          <div class="absolute bottom-3 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

.font-inter {
  font-family: 'Inter', sans-serif;
}

/* Animations CSS natives */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

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

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
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

@keyframes growUp {
  from { height: 0%; }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
  opacity: 0;
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
}

.animate-fade-in-left {
  animation: fadeInLeft 0.5s ease-out forwards;
  opacity: 0;
}

.animate-slide-down {
  animation: slideDown 0.5s ease-out forwards;
}

.animate-grow-up {
  animation: growUp 0.5s ease-out forwards;
}

/* Mobile Preview Slide Animation */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateX(100px) scale(0.95);
}

/* Hide scrollbar for mobile preview */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>