import { NavLink, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import { useNavigate } from 'react-router-dom'
import { cn } from '../../lib/utils'

const navItems = [
  { to: '/dashboard', icon: '▦', label: 'Dashboard' },
  { to: '/transactions', icon: '↕', label: 'Transactions' },
]

export default function AppLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-56 border-r border-slate-800 flex flex-col py-6 px-4 fixed h-full">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-7 h-7 rounded-lg bg-green-500 flex items-center justify-center text-xs font-bold text-slate-950">
            D
          </div>
          <span className="font-semibold text-slate-100 text-sm">DevFin</span>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                  isActive
                    ? 'bg-slate-800 text-slate-100 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                )
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-800 pt-4">
          <div className="px-3 mb-3">
            <p className="text-sm font-medium text-slate-300 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 rounded-lg transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-56 p-8">
        <Outlet />
      </main>
    </div>
  )
}
