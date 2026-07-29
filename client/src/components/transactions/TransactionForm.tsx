import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTransactionStore } from '../../store/transaction.store'
import { Transaction } from '../../types/transaction.types'
import { cn } from '../../lib/utils'

const schema = z.object({
  description: z.string().min(1, 'La descripción es obligatoria'),
  amount: z.coerce.number().positive('El monto debe ser mayor a 0'),
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().min(1, 'Elegí una categoría'),
  date: z.string().min(1, 'La fecha es obligatoria'),
})

type FormData = z.infer<typeof schema>

interface Props {
  transaction?: Transaction | null
  onClose: () => void
}

export default function TransactionForm({ transaction, onClose }: Props) {
  const { categories, createTransaction, updateTransaction, isSubmitting } =
    useTransactionStore()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: transaction
      ? {
          description: transaction.description,
          amount: parseFloat(transaction.amount),
          type: transaction.type,
          categoryId: transaction.categoryId,
          date: transaction.date.slice(0, 10),
        }
      : {
          type: 'EXPENSE',
          date: new Date().toISOString().slice(0, 10),
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
      date: new Date(data.date).toISOString(),
    }

    if (transaction) {
      await updateTransaction(transaction.id, payload)
    } else {
      await createTransaction(payload)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-lavender-800/30 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-strong rounded-3xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-white/40 dark:border-white/10">
          <h2 className="font-semibold text-lavender-800 dark:text-white">
            {transaction ? 'Editar movimiento' : 'Nuevo movimiento'}
          </h2>
          <button
            onClick={onClose}
            className="text-lavender-400 dark:text-lavender-200/70 hover:text-lavender-700 dark:hover:text-white transition-colors"
          >
            ✕
          </button>
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

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-lavender-600 dark:text-lavender-200 mb-1.5">
              Monto
            </label>
            <input
              {...register('amount')}
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full glass rounded-xl px-3.5 py-2.5 text-lavender-800 dark:text-white placeholder:text-lavender-300 dark:placeholder:text-lavender-200/40 focus:outline-none focus:ring-2 focus:ring-lavender-400/40 transition text-sm"
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-peach-500">{errors.amount.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-lavender-600 dark:text-lavender-200 mb-1.5">
              Descripción
            </label>
            <input
              {...register('description')}
              type="text"
              placeholder="Ej: Almuerzo en la oficina"
              className="w-full glass rounded-xl px-3.5 py-2.5 text-lavender-800 dark:text-white placeholder:text-lavender-300 dark:placeholder:text-lavender-200/40 focus:outline-none focus:ring-2 focus:ring-lavender-400/40 transition text-sm"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-peach-500">{errors.description.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-lavender-600 dark:text-lavender-200 mb-1.5">
              Categoría
            </label>
            <select
              {...register('categoryId')}
              className="w-full glass rounded-xl px-3.5 py-2.5 text-lavender-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-lavender-400/40 transition text-sm"
            >
              <option value="">Elegí una categoría</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-xs text-peach-500">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-lavender-600 dark:text-lavender-200 mb-1.5">
              Fecha
            </label>
            <input
              {...register('date')}
              type="date"
              className="w-full glass rounded-xl px-3.5 py-2.5 text-lavender-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-lavender-400/40 transition text-sm"
            />
            {errors.date && (
              <p className="mt-1 text-xs text-peach-500">{errors.date.message}</p>
            )}
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
              {isSubmitting ? 'Guardando...' : transaction ? 'Guardar cambios' : 'Agregar movimiento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
