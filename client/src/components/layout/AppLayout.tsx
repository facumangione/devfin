import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/auth.store'
import { useThemeStore } from '../../store/theme.store'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { to: '/dashboard', icon: '🏠', label: 'Inicio' },
  { to: '/transactions', icon: '🧾', label: 'Movimientos' },
  { to: '/recurring', icon: '🔄', label: 'Recurrentes' },
  { to: '/profile', icon: '⚙️', label: 'Perfil' },
]

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const { isDark } = useThemeStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isDashboard = location.pathname === '/dashboard'

  useEffect(() => {
    document.body.classList.toggle('dark', isDark)
  }, [isDark])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleNavClick = () => setMobileOpen(false)

  return (
    <div className="min-h-screen md:flex">
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-30 px-4 pt-4">
        <div className="glass-strong rounded-2xl px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setMobileOpen(true)}
            className="text-lavender-700 dark:text-white text-xl leading-none"
            aria-label="Abrir menú"
          >
            ☰
          </button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src="/favicon.svg" alt="DevFin" className="w-7 h-7 rounded-lg" />
            <span className="font-semibold text-lavender-800 dark:text-white text-sm">Registro de Wallet</span>
          </Link>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full py-6 px-4 flex flex-col z-50 transition-transform duration-300 w-60',
          'md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-[120%]'
        )}
      >
        <div className="glass-strong rounded-2xl p-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between gap-2 px-1 mb-8">
            <Link to="/dashboard" onClick={handleNavClick} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/favicon.svg" alt="DevFin" className="w-9 h-9 rounded-xl" />
              <div>
                <span className="font-semibold text-lavender-800 dark:text-white text-sm block leading-tight">
                  Registro de Wallet
                </span>
                <span className="text-[10px] text-lavender-400 dark:text-lavender-200/70">DevFin</span>
              </div>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-lavender-400 dark:text-lavender-200/70 text-lg leading-none"
            >✕</button>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={handleNavClick}
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

      <div className="flex-1 md:ml-60">
        <header className="hidden md:flex sticky top-0 z-10 px-8 pt-6 pb-2 justify-between items-center">
          {isDashboard ? (
            <span />
          ) : (
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-sm font-medium text-lavender-600 dark:text-lavender-200 hover:text-lavender-800 dark:hover:text-white transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Volver al inicio
            </Link>
          )}
          <ThemeToggle />
        </header>
        <main className="px-4 pb-8 pt-4 md:px-8 md:pt-0 md:-mt-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}