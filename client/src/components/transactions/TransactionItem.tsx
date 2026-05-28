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
    if (!confirm('Delete this transaction?')) return
    setIsDeleting(true)
    await deleteTransaction(transaction.id)
    setIsDeleting(false)
  }

  const amount = parseFloat(transaction.amount)
  const isIncome = transaction.type === 'INCOME'
  const date = new Date(transaction.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="flex items-center gap-4 p-4 hover:bg-slate-800/50 rounded-xl transition-colors group">
      {/* Category icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
        style={{ backgroundColor: `${transaction.category.color}20` }}
      >
        {transaction.category.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-100 truncate">
          {transaction.description}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          {transaction.category.name} · {date}
        </p>
      </div>

      {/* Amount */}
      <div className="text-right">
        <p
          className={`text-sm font-semibold ${
            isIncome ? 'text-green-400' : 'text-red-400'
          }`}
        >
          {isIncome ? '+' : '-'}${amount.toFixed(2)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(transaction)}
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-700 rounded-lg transition-colors text-xs"
        >
          ✏️
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-xs"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
