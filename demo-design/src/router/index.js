// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Pages
import Login from '../pages/Login.vue'
import Dashboard from '../pages/Dashboard.vue'
import CreateChain from '../pages/CreateChain.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/create',
    name: 'CreateChain',
    component: CreateChain,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// ✅ Navigation Guard pour protéger les routes
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('daftlink_token')
  const isAuthenticated = !!token

  // Route protégée mais pas authentifié
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  // Route guest (login) mais déjà authentifié
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
    return
  }

  next()
})

export default router
