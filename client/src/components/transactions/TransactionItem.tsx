import { useState } from 'react'
import { Transaction } from '../../types/transaction.types'
import { useTransactionStore } from '../../store/transaction.store'

interface Props {
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
}

export default function TransactionItem({ transaction, onEdit }: Props) {
  const { deleteTransaction } = useTransactionStore()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('¿Borrar este movimiento?')) return
    setIsDeleting(true)
    await deleteTransaction(transaction.id)
    setIsDeleting(false)
  }

  const amount = parseFloat(transaction.amount)
  const isIncome = transaction.type === 'INCOME'
  const date = new Date(transaction.date).toLocaleDateString('es-AR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-black/[0.03] dark:hover:bg-white/5 rounded-xl transition-colors group">
      {/* Category icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ backgroundColor: `${transaction.category.color}20` }}
      >
        {transaction.category.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-lavender-800 dark:text-white truncate">
          {transaction.description}
        </p>
        <p className="text-xs text-lavender-400 dark:text-lavender-200/60 mt-0.5">
          {transaction.category.name} · {date}
          {(transaction as any).status === 'pending' && (
            <span className="ml-2 text-[10px] bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-medium">
              Programado
            </span>
          )}
        </p>
      </div>

      {/* Amount */}
      <div className="text-right">
        <p
          className={`text-sm font-semibold ${
            isIncome ? 'text-mint-400 dark:text-emerald-300' : 'text-peach-400 dark:text-rose-300'
          }`}
        >
          {isIncome ? '+' : '-'}${amount.toFixed(2)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(transaction)}
          className="p-1.5 text-lavender-400 dark:text-lavender-200/60 hover:text-lavender-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors text-xs"
        >
          ✏️
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-1.5 text-lavender-400 dark:text-lavender-200/60 hover:text-peach-600 dark:hover:text-rose-300 hover:bg-peach-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors text-xs"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
