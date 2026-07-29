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
    if (!confirm('¿Eliminar este movimiento?')) return
    setIsDeleting(true)
    await deleteTransaction(transaction.id)
    setIsDeleting(false)
  }

  const amount = parseFloat(transaction.amount)
  const isIncome = transaction.type === 'INCOME'
  const date = new Date(transaction.date).toLocaleDateString('es-AR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-white/20 dark:hover:bg-white/5 transition-colors group">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-lavender-800 dark:text-white truncate">
          {transaction.description}
        </p>
        <p className="text-xs text-lavender-400 dark:text-lavender-200/50 mt-0.5">
          {transaction.category.name} · {date}
          {(transaction as any).status === 'pending' && (
            <span className="ml-2 text-[10px] border border-lavender-300 dark:border-lavender-200/20 text-lavender-400 dark:text-lavender-200/50 px-1.5 py-0.5 rounded-full">
              Programado
            </span>
          )}
        </p>
      </div>

      <p className={`text-sm font-medium tabular-nums shrink-0 ${
        isIncome
          ? 'text-lavender-800 dark:text-white'
          : 'text-lavender-400 dark:text-lavender-200/70'
      }`}>
        {isIncome ? '+' : '−'}${amount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
      </p>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(transaction)}
          className="p-1.5 text-lavender-400 dark:text-lavender-200/50 hover:text-lavender-700 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10 rounded-lg transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4Z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-1.5 text-lavender-400 dark:text-lavender-200/50 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-40"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}