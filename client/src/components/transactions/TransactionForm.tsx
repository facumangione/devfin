import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTransactionStore } from '../../store/transaction.store'
import { Transaction } from '../../types/transaction.types'
import { cn } from '../../lib/utils'

const schema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="font-semibold text-slate-100">
            {transaction ? 'Edit transaction' : 'New transaction'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          {/* Type toggle */}
          <div className="flex rounded-lg overflow-hidden border border-slate-700">
            {(['EXPENSE', 'INCOME'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setValue('type', type)}
                className={cn(
                  'flex-1 py-2 text-sm font-medium transition-colors',
                  selectedType === type
                    ? type === 'EXPENSE'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-green-500/20 text-green-400'
                    : 'text-slate-400 hover:text-slate-200'
                )}
              >
                {type === 'EXPENSE' ? '↓ Expense' : '↑ Income'}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Amount
            </label>
            <input
              {...register('amount')}
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition text-sm"
            />
            {errors.amount && (
              <p className="mt-1 text-xs text-red-400">{errors.amount.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Description
            </label>
            <input
              {...register('description')}
              type="text"
              placeholder="e.g. Lunch at the office"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition text-sm"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-400">{errors.description.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Category
            </label>
            <select
              {...register('categoryId')}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition text-sm"
            >
              <option value="">Select a category</option>
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-xs text-red-400">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Date
            </label>
            <input
              {...register('date')}
              type="date"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2.5 text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition text-sm"
            />
            {errors.date && (
              <p className="mt-1 text-xs text-red-400">{errors.date.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg py-2.5 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-slate-950 font-semibold rounded-lg py-2.5 text-sm transition-colors"
            >
              {isSubmitting ? 'Saving...' : transaction ? 'Save changes' : 'Add transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
