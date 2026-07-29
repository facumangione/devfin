import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/auth.store'
import { useThemeStore } from '../../store/theme.store'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'
import ThemeToggle from './ThemeToggle'

const navItems = [
  {
    to: '/dashboard',
    label: 'Inicio',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    to: '/transactions',
    label: 'Movimientos',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/recurring',
    label: 'Recurrentes',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 2l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" strokeLinecap="round" />
        <path d="M7 22l-4-4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Perfil',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function AppLayout() {
  const { logout } = useAuthStore()
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
            className="text-lavender-600 dark:text-lavender-200/70 hover:text-lavender-800 dark:hover:text-white transition-colors"
            aria-label="Abrir menú"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
            </svg>
          </button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src="/favicon.svg" alt="DevFin" className="w-6 h-6 rounded-lg" />
            <span className="font-semibold text-lavender-800 dark:text-white text-sm">DevFin</span>
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
          'fixed top-0 left-0 h-full py-6 px-4 flex flex-col z-50 transition-transform duration-300 w-56',
          'md:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-[120%]'
        )}
      >
        <div className="glass-strong rounded-2xl p-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between gap-2 px-1 mb-8">
            <Link to="/dashboard" onClick={handleNavClick} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <img src="/favicon.svg" alt="DevFin" className="w-7 h-7 rounded-lg" />
              <span className="font-semibold text-lavender-800 dark:text-white text-sm">DevFin</span>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-lavender-400 dark:text-lavender-200/50"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 space-y-0.5">
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
                      : 'text-lavender-400 dark:text-lavender-200/60 hover:bg-white/30 dark:hover:bg-white/5 hover:text-lavender-700 dark:hover:text-lavender-200'
                  )
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="pt-4 border-t border-white/40 dark:border-white/10">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-lavender-400 dark:text-lavender-200/60 hover:bg-white/30 dark:hover:bg-white/5 hover:text-lavender-700 dark:hover:text-lavender-200 rounded-xl transition-colors flex items-center gap-3"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" />
                <path d="M16 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 12H9" strokeLinecap="round" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 md:ml-56">
        <header className="hidden md:flex sticky top-0 z-10 px-8 pt-6 pb-2 justify-between items-center">
          {isDashboard ? (
            <span />
          ) : (
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-sm text-lavender-400 dark:text-lavender-200/60 hover:text-lavender-800 dark:hover:text-white transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Inicio
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