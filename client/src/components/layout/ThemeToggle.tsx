import { useEffect } from 'react'
import { useThemeStore } from '../../store/theme.store'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeStore()

  useEffect(() => {
    document.body.classList.toggle('dark', isDark)
  }, [isDark])

  return (
    <button
      onClick={toggleTheme}
      className="glass w-9 h-9 rounded-xl flex items-center justify-center text-base transition-transform hover:scale-105 active:scale-95"
      aria-label="Cambiar tema"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}
