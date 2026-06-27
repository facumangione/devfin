import { useState } from 'react'
import { useAuthStore } from '../../store/auth.store'
import { api } from '../../lib/api'

export default function ProfilePage() {
  const { user, fetchMe } = useAuthStore()
  const [name, setName] = useState(user?.name ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [nameMsg, setNameMsg] = useState('')
  const [passMsg, setPassMsg] = useState('')
  const [nameError, setNameError] = useState('')
  const [passError, setPassError] = useState('')
  const [loadingName, setLoadingName] = useState(false)
  const [loadingPass, setLoadingPass] = useState(false)

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
    setLoadingPass(true)
    try {
      await api.patch('/auth/password', { currentPassword, newPassword })
      setPassMsg('Contraseña actualizada correctamente')
      setCurrentPassword('')
      setNewPassword('')
    } catch (e: any) {
      setPassError(e.response?.data?.error || 'Algo salió mal')
    } finally {
      setLoadingPass(false)
    }
  }

  return (
    <div>
      <div className="mb-6 pt-2">
        <h1 className="text-xl font-semibold text-lavender-800 dark:text-white">Mi perfil</h1>
        <p className="text-sm text-lavender-400 dark:text-lavender-200/60 mt-0.5">Configurá tu cuenta</p>
      </div>

      <div className="max-w-md space-y-4">
        {/* Nombre */}
        <div className="glass rounded-2xl p-5">
          <h2 className="font-medium text-lavender-800 dark:text-white text-sm mb-4">Cambiar nombre</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-lavender-600 dark:text-lavender-200 mb-1.5">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full glass rounded-xl px-3.5 py-2.5 text-lavender-800 dark:text-white placeholder:text-lavender-300 dark:placeholder:text-lavender-200/40 focus:outline-none focus:ring-2 focus:ring-lavender-400/40 transition text-sm"
              />
            </div>
            {nameMsg && <p className="text-xs text-mint-400 dark:text-emerald-300">{nameMsg}</p>}
            {nameError && <p className="text-xs text-peach-500">{nameError}</p>}
            <button
              onClick={handleUpdateName}
              disabled={loadingName}
              className="w-full bg-lavender-400 hover:bg-lavender-600 disabled:opacity-50 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
            >
              {loadingName ? 'Guardando...' : 'Guardar nombre'}
            </button>
          </div>
        </div>

        {/* Contraseña */}
        <div className="glass rounded-2xl p-5">
          <h2 className="font-medium text-lavender-800 dark:text-white text-sm mb-4">Cambiar contraseña</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-lavender-600 dark:text-lavender-200 mb-1.5">Contraseña actual</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full glass rounded-xl px-3.5 py-2.5 text-lavender-800 dark:text-white placeholder:text-lavender-300 dark:placeholder:text-lavender-200/40 focus:outline-none focus:ring-2 focus:ring-lavender-400/40 transition text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-lavender-600 dark:text-lavender-200 mb-1.5">Nueva contraseña</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full glass rounded-xl px-3.5 py-2.5 text-lavender-800 dark:text-white placeholder:text-lavender-300 dark:placeholder:text-lavender-200/40 focus:outline-none focus:ring-2 focus:ring-lavender-400/40 transition text-sm"
              />
            </div>
            {passMsg && <p className="text-xs text-mint-400 dark:text-emerald-300">{passMsg}</p>}
            {passError && <p className="text-xs text-peach-500">{passError}</p>}
            <button
              onClick={handleUpdatePassword}
              disabled={loadingPass}
              className="w-full bg-lavender-400 hover:bg-lavender-600 disabled:opacity-50 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
            >
              {loadingPass ? 'Guardando...' : 'Cambiar contraseña'}
            </button>
          </div>
        </div>

        {/* Info cuenta */}
        <div className="glass rounded-2xl p-5">
          <h2 className="font-medium text-lavender-800 dark:text-white text-sm mb-3">Información de la cuenta</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-lavender-400 dark:text-lavender-200/70">Email</span>
              <span className="text-lavender-800 dark:text-white">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-lavender-400 dark:text-lavender-200/70">Notificaciones</span>
              <span className="text-lavender-800 dark:text-white">Cada lunes por email</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}