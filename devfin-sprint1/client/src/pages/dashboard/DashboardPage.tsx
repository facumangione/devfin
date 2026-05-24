import { useAuthStore } from '../../store/auth.store'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-sm font-bold text-slate-950">
              D
            </div>
            <span className="font-semibold text-slate-100">DevFin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
          <div className="text-4xl mb-4">🚧</div>
          <h2 className="text-xl font-semibold text-slate-100 mb-2">
            Dashboard coming in Sprint 2
          </h2>
          <p className="text-slate-400 text-sm">
            Auth is working. Next sprint: transactions and the real dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}
