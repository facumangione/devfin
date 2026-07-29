import { useState } from 'react'
import { useAuthStore } from '../../store/auth.store'
import { api } from '../../lib/api'

const DAYS = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' },
]

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')
}

function formatMemberSince(dateStr?: string) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })
}

function PasswordInput({
  value,
  onChange,
  show,
  onToggleShow,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  show: boolean
  onToggleShow: () => void
  placeholder?: string
}) {
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full glass rounded-xl px-3.5 py-2.5 pr-10 text-lavender-800 dark:text-white placeholder:text-lavender-300 dark:placeholder:text-lavender-200/40 focus:outline-none focus:ring-2 focus:ring-gold-500/40 transition text-sm"
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-lavender-400 dark:text-lavender-200/50 hover:text-lavender-600 dark:hover:text-lavender-200 transition"
        tabIndex={-1}
      >
        {show ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  )
}

export default function ProfilePage() {
  const { user, fetchMe } = useAuthStore()
  const [name, setName] = useState(user?.name ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nameMsg, setNameMsg] = useState('')
  const [passMsg, setPassMsg] = useState('')
  const [nameError, setNameError] = useState('')
  const [passError, setPassError] = useState('')
  const [loadingName, setLoadingName] = useState(false)
  const [loadingPass, setLoadingPass] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [weeklyEmailEnabled, setWeeklyEmailEnabled] = useState(user?.weeklyEmailEnabled ?? true)
  const [weeklyEmailDay, setWeeklyEmailDay] = useState(user?.weeklyEmailDay ?? 1)
  const [emailMsg, setEmailMsg] = useState('')
  const [emailError, setEmailError] = useState('')
  const [loadingEmail, setLoadingEmail] = useState(false)

  const handleUpdateName = async () => {
    setNameMsg('')
    setNameError('')
    setLoadingName(true)
    try {
      await api.patch('/auth/profile', { name })
      await fetchMe()
      setNameMsg('Nombre actualizado correctamente')
    } catch (e: any) {
      setNameError(e.response?.data?.error || 'Algo salió mal')
    } finally {
      setLoadingName(false)
    }
  }

  const handleUpdatePassword = async () => {
    setPassMsg('')
    setPassError('')

    if (newPassword !== confirmPassword) {
      setPassError('Las contraseñas no coinciden')
      return
    }

    setLoadingPass(true)
    try {
      await api.patch('/auth/password', { currentPassword, newPassword })
      setPassMsg('Contraseña actualizada correctamente')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (e: any) {
      setPassError(e.response?.data?.error || 'Algo salió mal')
    } finally {
      setLoadingPass(false)
    }
  }

  const handleUpdateEmailPrefs = async () => {
    setEmailMsg('')
    setEmailError('')
    setLoadingEmail(true)
    try {
      await api.patch('/auth/email-preferences', { weeklyEmailEnabled, weeklyEmailDay })
      await fetchMe()
      setEmailMsg('Preferencia guardada correctamente')
    } catch (e: any) {
      setEmailError(e.response?.data?.error || 'Algo salió mal')
    } finally {
      setLoadingEmail(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 pt-2 flex flex-col items-center text-center">
        <div className="flex items-center gap-2.5 mb-1">
          <img src="/favicon.svg" alt="DevFin" className="w-7 h-7 rounded-lg" />
          <h1 className="text-xl font-semibold text-lavender-800 dark:text-white">Mi perfil</h1>
        </div>
        <p className="text-sm text-lavender-400 dark:text-lavender-200/60">Configurá tu cuenta</p>
      </div>

      <div className="space-y-6">
        {/* Hero: avatar + identidad */}
        <div className="glass-strong rounded-2xl p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-lavender-400 to-mint-400 flex items-center justify-center text-white text-xl font-semibold shrink-0 shadow-md">
            {getInitials(user?.name ?? '')}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-lavender-800 dark:text-white truncate">
              {user?.name}
            </h2>
            <p className="text-sm text-lavender-400 dark:text-lavender-200/70 truncate">{user?.email}</p>
            {user?.createdAt && (
              <p className="text-xs text-lavender-300 dark:text-lavender-200/50 mt-1">
                Miembro desde {formatMemberSince(user.createdAt)}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Columna izquierda: nombre + resumen semanal */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-full bg-lavender-100 dark:bg-gold-500/10 flex items-center justify-center text-lavender-600 dark:text-lavender-200 shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" strokeLinecap="round" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-medium text-lavender-800 dark:text-white text-sm">Cambiar nombre</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-lavender-600 dark:text-lavender-200 mb-1.5">Nombre</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full glass rounded-xl px-3.5 py-2.5 text-lavender-800 dark:text-white placeholder:text-lavender-300 dark:placeholder:text-lavender-200/40 focus:outline-none focus:ring-2 focus:ring-gold-500/40 transition text-sm"
                  />
                </div>
                {nameMsg && <p className="text-xs text-mint-400 dark:text-emerald-300">{nameMsg}</p>}
                {nameError && <p className="text-xs text-peach-500">{nameError}</p>}
                <button
                  onClick={handleUpdateName}
                  disabled={loadingName}
                  className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
                >
                  {loadingName ? 'Guardando...' : 'Guardar nombre'}
                </button>
              </div>
            </div>

            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-full bg-mint-100 dark:bg-mint-400/10 flex items-center justify-center text-mint-600 dark:text-mint-400 shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16v16H4z" strokeLinecap="round" strokeLinejoin="round" opacity="0" />
                    <path d="M3 6h18v12H3z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M3 6l9 7 9-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-medium text-lavender-800 dark:text-white text-sm">Resumen semanal por email</h3>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-lavender-600 dark:text-lavender-200">Recibir el resumen</span>
                <button
                  type="button"
                  onClick={() => setWeeklyEmailEnabled((v) => !v)}
                  aria-pressed={weeklyEmailEnabled}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
                    weeklyEmailEnabled ? 'bg-gold-500' : 'bg-lavender-200 dark:bg-white/10'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      weeklyEmailEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-lavender-600 dark:text-lavender-200 mb-1.5">
                    Día de envío
                  </label>
                  <select
                    value={weeklyEmailDay}
                    onChange={(e) => setWeeklyEmailDay(Number(e.target.value))}
                    disabled={!weeklyEmailEnabled}
                    className="w-full glass rounded-xl px-3.5 py-2.5 text-lavender-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-gold-500/40 transition text-sm disabled:opacity-50"
                  >
                    {DAYS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
                {emailMsg && <p className="text-xs text-mint-400 dark:text-emerald-300">{emailMsg}</p>}
                {emailError && <p className="text-xs text-peach-500">{emailError}</p>}
                <button
                  onClick={handleUpdateEmailPrefs}
                  disabled={loadingEmail}
                  className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
                >
                  {loadingEmail ? 'Guardando...' : 'Guardar preferencia'}
                </button>
              </div>
            </div>
          </div>

          {/* Columna derecha: seguridad */}
          <div className="glass rounded-2xl p-5 h-fit">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-peach-100 dark:bg-peach-400/10 flex items-center justify-center text-peach-600 dark:text-peach-400 shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
              </div>
              <h3 className="font-medium text-lavender-800 dark:text-white text-sm">Cambiar contraseña</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-lavender-600 dark:text-lavender-200 mb-1.5">Contraseña actual</label>
                <PasswordInput
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  show={showCurrentPassword}
                  onToggleShow={() => setShowCurrentPassword((v) => !v)}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-lavender-600 dark:text-lavender-200 mb-1.5">Nueva contraseña</label>
                <PasswordInput
                  value={newPassword}
                  onChange={setNewPassword}
                  show={showNewPassword}
                  onToggleShow={() => setShowNewPassword((v) => !v)}
                  placeholder="Mínimo 8 caracteres"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-lavender-600 dark:text-lavender-200 mb-1.5">Repetir nueva contraseña</label>
                <PasswordInput
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  show={showConfirmPassword}
                  onToggleShow={() => setShowConfirmPassword((v) => !v)}
                  placeholder="Repetí la contraseña"
                />
              </div>
              {passMsg && <p className="text-xs text-mint-400 dark:text-emerald-300">{passMsg}</p>}
              {passError && <p className="text-xs text-peach-500">{passError}</p>}
              <button
                onClick={handleUpdatePassword}
                disabled={loadingPass}
                className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
              >
                {loadingPass ? 'Guardando...' : 'Cambiar contraseña'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}