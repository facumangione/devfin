import { create } from 'zustand'
import { api } from '../lib/api'

interface User {
  id: string
  name: string
  email: string
  createdAt: string
  weeklyEmailEnabled: boolean
  weeklyEmailDay: number
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: !!localStorage.getItem('accessToken'), // si hay token, esperar a verificarlo
  isAuthenticated: false,

  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      set({ user: data.user, isAuthenticated: true })
    } finally {
      set({ isLoading: false })
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true })
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      set({ user: data.user, isAuthenticated: true })
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    await api.post('/auth/logout', { refreshToken }).catch(() => {})
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    set({ user: null, isAuthenticated: false })
  },

  fetchMe: async () => {
    const token = localStorage.getItem('accessToken')
    if (!token) {
      set({ isLoading: false }) // sin token, terminar carga inmediatamente
      return
    }

    set({ isLoading: true })
    try {
      const { data } = await api.get('/auth/me')
      set({ user: data.user, isAuthenticated: true })
    } catch {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      set({ isAuthenticated: false })
    } finally {
      set({ isLoading: false })
    }
  },
}))