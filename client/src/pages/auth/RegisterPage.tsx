import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../../store/auth.store'
import { useThemeStore } from '../../store/theme.store'

const schema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresá un email válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register: registerUser, isLoading } = useAuthStore()
  const { isDark } = useThemeStore()
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    document.body.classList.toggle('dark', isDark)
  }, [isDark])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError('')
    try {
      await registerUser(data.name, data.email, data.password)
      navigate('/dashboard')
    } catch (err: any) {
      setServerError(err.response?.data?.error || 'Algo salió mal')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="glass-strong rounded-3xl p-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <img src="/favicon.svg" alt="DevFin" className="w-9 h-9 rounded-xl" />
              <span className="font-semibold text-lavender-800 dark:text-white">DevFin</span>
            </div>
            <h1 className="text-2xl font-semibold text-lavender-800 dark:text-white">Creá tu cuenta</h1>
            <p className="text-lavender-400 dark:text-lavender-200/70 mt-1 text-sm">Empezá a llevar tus finanzas</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <div className="bg-peach-50 dark:bg-rose-500/10 border border-peach-200 dark:border-rose-500/20 rounded-xl px-4 py-3 text-peach-600 dark:text-rose-200 text-sm">
                {serverError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-lavender-600 dark:text-lavender-200 mb-1.5">
                Nombre completo
              </label>
              <input
                {...register('name')}
                type="text"
                autoComplete="name"
                placeholder="Juan Pérez"
                className="w-full glass rounded-xl px-3.5 py-2.5 text-lavender-800 dark:text-white placeholder:text-lavender-300 dark:placeholder:text-lavender-200/40 focus:outline-none focus:ring-2 focus:ring-gold-500/40 transition text-sm"
              />
              {errors.name && <p className="mt-1 text-xs text-peach-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-lavender-600 dark:text-lavender-200 mb-1.5">
                Email
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder="vos@ejemplo.com"
                className="w-full glass rounded-xl px-3.5 py-2.5 text-lavender-800 dark:text-white placeholder:text-lavender-300 dark:placeholder:text-lavender-200/40 focus:outline-none focus:ring-2 focus:ring-gold-500/40 transition text-sm"
              />
              {errors.email && <p className="mt-1 text-xs text-peach-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-lavender-600 dark:text-lavender-200 mb-1.5">
                Contraseña
              </label>
              <input
                {...register('password')}
                type="password"
                autoComplete="new-password"
                placeholder="Mínimo 8 caracteres"
                className="w-full glass rounded-xl px-3.5 py-2.5 text-lavender-800 dark:text-white placeholder:text-lavender-300 dark:placeholder:text-lavender-200/40 focus:outline-none focus:ring-2 focus:ring-gold-500/40 transition text-sm"
              />
              {errors.password && <p className="mt-1 text-xs text-peach-500">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gold-500 hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
            >
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-lavender-400 dark:text-lavender-200/70">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login" className="text-lavender-600 dark:text-lavender-200 hover:underline font-medium">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}