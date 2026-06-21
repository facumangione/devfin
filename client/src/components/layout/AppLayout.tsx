import { NavLink, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from '../../store/auth.store'
import { useThemeStore } from '../../store/theme.store'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { to: '/dashboard', icon: '🏠', label: 'Inicio' },
  { to: '/transactions', icon: '🧾', label: 'Movimientos' },
]

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const { isDark } = useThemeStore()
  const navigate = useNavigate()

  useEffect(() => {
    document.body.classList.toggle('dark', isDark)
  }, [isDark])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-60 fixed h-full py-6 px-4 flex flex-col">
        <div className="glass-strong rounded-2xl p-4 flex-1 flex flex-col">
          <div className="flex items-center gap-2 px-1 mb-8">
            <img src="/favicon.svg" alt="DevFin" className="w-9 h-9 rounded-xl" />
            <div>
              <span className="font-semibold text-lavender-800 dark:text-white text-sm block leading-tight">
                Estudio Contable
              </span>
              <span className="text-[10px] text-lavender-400 dark:text-lavender-200/70">DevFin</span>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
                    isActive
                      ? 'glass font-medium text-lavender-800 dark:text-white'
                      : 'text-lavender-400 dark:text-lavender-200/70 hover:bg-white/30 dark:hover:bg-white/5'
                  )
                }
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-4 border-t border-white/40 dark:border-white/10">
            <div className="px-3 mb-3">
              <p className="text-sm font-medium text-lavender-800 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-lavender-400 dark:text-lavender-200/60 truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-lavender-400 dark:text-lavender-200/70 hover:bg-white/30 dark:hover:bg-white/5 rounded-xl transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 ml-60">
        <header className="sticky top-0 z-10 px-8 pt-6 pb-2 flex justify-end">
          <ThemeToggle />
        </header>
        <main className="px-8 pb-8 -mt-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}