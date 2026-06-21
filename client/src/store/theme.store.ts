import { create } from 'zustand'

interface ThemeState {
  isDark: boolean
  toggleTheme: () => void
}

const getInitialTheme = (): boolean => {
  if (typeof window === 'undefined') return true
  const stored = localStorage.getItem('devfin-theme')
  if (stored) return stored === 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  isDark: getInitialTheme(),
  toggleTheme: () => {
    const newValue = !get().isDark
    localStorage.setItem('devfin-theme', newValue ? 'dark' : 'light')
    set({ isDark: newValue })
  },
}))
