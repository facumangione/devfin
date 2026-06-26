import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRecurringStore } from '../../store/recurring.store'
import { useTransactionStore } from '../../store/transaction.store'
import { RecurringPayment } from '../../types/recurring.types'
import { cn } from '../../lib/utils'

const schema = z.object({
  description: z.string().min(1, 'La descripción es obligatoria'),
  amount: z.coerce.number().positive('El monto debe ser mayor a 0'),
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().min(1, 'Elegí una categoría'),
  totalInstallments: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? null : Number(v)),
    z.number().int().positive().nullable()
  ),
  nextDueDate: z.string().min(1, 'La fecha es obligatoria'),
})

type FormData = z.infer<typeof schema>

interface Props {
  payment?: RecurringPayment | null
  onClose: () => void
}

export default function RecurringForm({ payment, onClose }: Props) {
  const { createPayment, updatePayment, isSubmitting } = useRecurringStore()
  const { categories, fetchCategories } = useTransactionStore()

  useEffect(() => {
    fetchCategories()
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: payment
      ? {
          description: payment.description,
          amount: parseFloat(payment.amount),
          type: payment.type,
          categoryId: payment.categoryId,
          totalInstallments: payment.totalInstallments,
          nextDueDate: payment.nextDueDate.slice(0, 10),
        }
      : {
          type: 'EXPENSE',
          nextDueDate: new Date().toISOString().slice(0, 10),
        },
  })

  const selectedType = watch('type')
  const filteredCategories = categories.filter(
    (c) => c.type === selectedType || c.type === 'BOTH'
  )

  useEffect(() => {
    setValue('categoryId', '')
  }, [selectedType, setValue])

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      nextDueDate: new Date(data.nextDueDate).toISOString(),
      totalInstallments: data.totalInstallments || null,
    }
    if (payment) {
      await updatePayment(payment.id, payload)
    } else {
      await createPayment(payload)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-lavender-800/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-strong rounded-3xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-white/40 dark:border-white/10">
          <h2 className="font-semibold text-lavender-800 dark:text-white">
            {payment ? 'Editar pago recurrente' : 'Nuevo pago recurrente'}
          </h2>
          <button onClick={onClose} className="text-lavender-400 dark:text-lavender-200/70 hover:text-lavender-700 dark:hover:text-white transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          {/* Type toggle */}
          <div className="flex rounded-xl overflow-hidden glass p-1 gap-1">
            {(['EXPENSE', 'INCOME'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setValue('type', type)}
                className={cn(
                  'flex-1 py-2 rounded-lg text-sm font-medium transition-colors',
                  selectedType === type
                    ? type === 'EXPENSE'
                      ? 'bg-peach-100 text-peach-600 dark:bg-rose-500/20 dark:text-rose-200'
                      : 'bg-mint-100 text-mint-600 dark:bg-emerald-500/20 dark:text-emerald-200'
                    : 'text-lavender-400 dark:text-lavender-200/60 hover:text-lavender-600 dark:hover:text-white'
                )}
              >
                {type === 'EXPENSE' ? '↓ Egreso' : '↑ Ingreso'}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-lavender-600 dark:text-lavender-200 mb-1.5">Descripción</label>
            <input
              {...register('description')}
              type="text"
              placeholder="Ej: Netflix, Alquiler, Cuota préstamo"
              className="w-full glass rounded-xl px-3.5 py-2.5 text-lavender-800 dark:text-white placeholder:text-lavender-300 dark:placeholder:text-lavender-200/40 focus:outline-none focus:ring-2 focus:ring-lavender-400/40 transition text-sm"
            />
            {errors.description && <p className="mt-1 text-xs text-peach-500">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-lavender-600 dark:text-lavender-200 mb-1.5">Monto por cuota</label>
            <input
              {...register('amount')}
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full glass rounded-xl px-3.5 py-2.5 text-lavender-800 dark:text-white placeholder:text-lavender-300 dark:placeholder:text-lavender-200/40 focus:outline-none focus:ring-2 focus:ring-lavender-400/40 transition text-sm"
            />
            {errors.amount && <p className="mt-1 text-xs text-peach-500">{errors.amount.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-lavender-600 dark:text-lavender-200 mb-1.5">Categoría</label>
            <select
              {...register('categoryId')}
              className="w-full glass rounded-xl px-3.5 py-2.5 text-lavender-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-lavender-400/40 transition text-sm"
            >
              <option value="">Elegí una categoría</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
              ))}
            </select>
            {errors.categoryId && <p className="mt-1 text-xs text-peach-500">{errors.categoryId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-lavender-600 dark:text-lavender-200 mb-1.5">
              Cantidad de cuotas <span className="text-lavender-300 dark:text-lavender-200/50 font-normal">(dejá vacío si es indefinido)</span>
            </label>
            <input
              {...register('totalInstallments')}
              type="number"
              min="1"
              placeholder="Ej: 3, 6, 12 — vacío = sin límite"
              className="w-full glass rounded-xl px-3.5 py-2.5 text-lavender-800 dark:text-white placeholder:text-lavender-300 dark:placeholder:text-lavender-200/40 focus:outline-none focus:ring-2 focus:ring-lavender-400/40 transition text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-lavender-600 dark:text-lavender-200 mb-1.5">Primer vencimiento</label>
            <input
              {...register('nextDueDate')}
              type="date"
              className="w-full glass rounded-xl px-3.5 py-2.5 text-lavender-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-lavender-400/40 transition text-sm"
            />
            {errors.nextDueDate && <p className="mt-1 text-xs text-peach-500">{errors.nextDueDate.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 glass text-lavender-600 dark:text-lavender-200 rounded-xl py-2.5 text-sm font-medium transition-colors hover:bg-white/50 dark:hover:bg-white/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-lavender-400 hover:bg-lavender-600 disabled:opacity-50 text-white font-semibold rounded-xl py-2.5 text-sm transition-colors"
            >
              {isSubmitting ? 'Guardando...' : payment ? 'Guardar cambios' : 'Crear pago'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
